const state = {
  page: "dashboard",
  tab: {},
  query: "",
  operator: "全部运营商",
  view: "default",
  highlight: null
};

const RULES = [
  { id: "R-001", name: "桌面审阅壳层", when: "打开原型", text: "左侧为 1440 桌面后台原型，右侧为规则标注。不包含登录页，直接进入超管后台。" },
  { id: "R-002", name: "业务域菜单", when: "使用左侧导航", text: "菜单按总览、数据、用户、员工、活动、产品、资金、内容、回传、系统、权限分组。单页切换，不做顶部多标签。" },
  { id: "R-003", name: "控制台下钻", when: "点击控制台 KPI", text: "KPI 卡片进入对应业务页，便于从总览跳到明细。" },
  { id: "R-004", name: "数据页必须有图", when: "打开数据类页面", text: "控制台、经营数据、留存分析、第三方事件、激励报表、提现审核均展示本地 Canvas 图表，不依赖外部 CDN。" },
  { id: "R-005", name: "列表筛选", when: "使用搜索/筛选", text: "列表支持筛选、重置、分页。无匹配显示空态，查询中显示加载态。" },
  { id: "R-006", name: "新增编辑抽屉", when: "点击新增或编辑", text: "配置和管理类操作用右侧抽屉完成，不跳新页。" },
  { id: "R-007", name: "必填校验", when: "提交空表单", text: "必填未填或格式错误时，字段旁提示且不提交。" },
  { id: "R-008", name: "成功反馈", when: "保存/审核成功", text: "关闭弹窗或抽屉，刷新列表，顶部显示成功提示。" },
  { id: "R-009", name: "失败可重试", when: "点击模拟失败后提交", text: "查询或提交失败时保留已填内容，页面内提示失败，允许重试。" },
  { id: "R-010", name: "删除驳回确认", when: "删除或驳回", text: "删除和驳回先弹出确认，取消则不变更数据。" },
  { id: "R-011", name: "审核状态流转", when: "提现或奖励审核", text: "通过后状态变为打款中或已发放；驳回后状态变为已驳回。" },
  { id: "R-012", name: "同类页 Tab 收拢", when: "打开合并页", text: "团队、员工、提现配置、团队奖励、首页运营、平台配置用页内 Tab 收拢同类功能。" },
  { id: "R-013", name: "演示数据", when: "查看任何列表", text: "所有数据均为演示数据，手机号等敏感信息已脱敏。" },
  { id: "R-014", name: "仅超管视角", when: "浏览全部菜单", text: "本次只做超管全量菜单，不展示角色权限差异。" }
];

function $(id) { return document.getElementById(id); }
function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 1800);
}
function mark(id) {
  return '<button type="button" class="rule-mark" data-rule-id="' + id + '">' + id + "</button>";
}
function statusClass(v) {
  if (["正常", "启用", "上架", "已发放", "已打款", "成功", "在职", "已发送", "显示"].includes(v)) return "ok";
  if (["待审核", "打款中", "待发放", "进行中", "待处理", "草稿"].includes(v)) return "warn";
  if (["已驳回", "停用", "下架", "隐藏", "限制提现"].includes(v)) return "danger";
  return "info";
}
function findPageMeta() {
  for (const group of DEMO.nav) {
    const item = group.items.find(i => i.id === state.page);
    if (item) return { group: group.group, name: item.name };
  }
  return { group: "总览", name: "控制台" };
}
function renderNav() {
  $("nav").innerHTML = DEMO.nav.map(group => {
    const items = group.items.map(item => '<button class="nav-item ' + (state.page === item.id ? "active" : "") + '" data-page="' + item.id + '">' + item.name + "</button>").join("");
    return '<div class="nav-group"><div class="nav-label">' + group.group + "</div>" + items + "</div>";
  }).join("");
}

function operatorSelect() {
  return '<label class="field"><span>运营商</span><select id="operator">' + DEMO.operators.map(o => '<option' + (o === state.operator ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></label>';
}
function drawLine(canvas, labels, series, colors) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 520;
  const h = canvas.clientHeight || 220;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const max = Math.max(1, ...series.flat());
  ctx.strokeStyle = '#e5eaf1';
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, h - pad.b);
  ctx.lineTo(w - pad.r, h - pad.b);
  ctx.stroke();
  series.forEach((arr, si) => {
    ctx.strokeStyle = colors[si];
    ctx.lineWidth = 2;
    ctx.beginPath();
    arr.forEach((v, i) => {
      const x = pad.l + i * ((w - pad.l - pad.r) / Math.max(1, arr.length - 1));
      const y = pad.t + (1 - v / max) * (h - pad.t - pad.b);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  labels.forEach((label, i) => {
    const x = pad.l + i * ((w - pad.l - pad.r) / Math.max(1, labels.length - 1));
    ctx.fillText(label, x - 12, h - 10);
  });
}
function drawBars(canvas, labels, values, color) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 420;
  const h = canvas.clientHeight || 220;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(1, ...values);
  const bw = (w - 50) / values.length - 10;
  values.forEach((v, i) => {
    const x = 36 + i * (bw + 10);
    const bh = (v / max) * (h - 50);
    ctx.fillStyle = color;
    ctx.fillRect(x, h - 28 - bh, bw, bh);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(labels[i], x, h - 10);
  });
}
function table(headers, rows, actionsHtml) {
  if (state.view === 'loading') return '<div class="loading">正在查询演示数据...</div>';
  if (state.view === 'error') return '<div class="error-box" data-rule-id="R-009">查询失败，请保留当前条件后重试。' + mark('R-009') + '</div>';
  if (!rows.length || state.view === 'empty') return '<div class="empty">没有找到匹配的记录</div>';
  const head = headers.map(h => '<th>' + h + '</th>').join('') + (actionsHtml ? '<th>操作</th>' : '');
  const body = rows.map((row, idx) => '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + (actionsHtml ? '<td class="row-actions">' + actionsHtml(idx) + '</td>' : '') + '</tr>').join('');
  return '<div class="table-wrap"><table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div><div class="pager"><span>显示第 1 到第 ' + rows.length + ' 条，共 ' + rows.length + ' 条演示记录</span><span>上一页 1 下一页</span></div>';
}
function filterBar(placeholder) {
  return '<div class="filters" data-rule-id="R-005">' + operatorSelect() + '<label class="field"><span>关键词</span><input id="q" value="' + state.query + '" placeholder="' + placeholder + '"></label><button class="btn" id="btn-search">查询 ' + mark('R-005') + '</button><button class="btn secondary" id="btn-reset-filter">重置</button></div>';
}
function matchQuery(row) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  return Object.values(row).join(' ').toLowerCase().includes(q);
}
function openDrawer(title, body, footer) {
  $('drawer').innerHTML = '<div class="drawer-head"><h3>' + title + '</h3></div>' + body + '<div style="display:flex;gap:8px;margin-top:16px">' + footer + '</div>';
  $('drawer-mask').classList.remove('hidden');
}
function closeDrawer() { $('drawer-mask').classList.add('hidden'); }
function openModal(html) {
  $('modal').innerHTML = html;
  $('modal-mask').classList.remove('hidden');
}
function closeModal() { $('modal-mask').classList.add('hidden'); }

function formFields(fields) {
  return '<form id="edit-form" class="form-grid" data-rule-id="R-007">' + fields.map(f => {
    let control = '';
    if (f.type === 'select') {
      control = '<select name="' + f.name + '">' + f.options.map(o => '<option' + (o === (f.value || '') ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
    } else if (f.type === 'textarea') {
      control = '<textarea name="' + f.name + '">' + (f.value || '') + '</textarea>';
    } else {
      control = '<input name="' + f.name + '" value="' + (f.value || '') + '" placeholder="' + (f.placeholder || '') + '">';
    }
    return '<label class="field ' + (f.full ? 'full' : '') + '"><span>' + f.label + (f.required ? ' *' : '') + '</span>' + control + '<div class="field-error" data-error-for="' + f.name + '"></div></label>';
  }).join('') + '</form>';
}
function validate(fields) {
  let ok = true;
  fields.forEach(f => {
    if (!f.required) return;
    const input = document.querySelector('[name="' + f.name + '"]');
    const err = document.querySelector('[data-error-for="' + f.name + '"]');
    if (!input.value.trim()) { err.textContent = '请填写' + f.label; ok = false; }
    else err.textContent = '';
  });
  return ok;
}
function saveFlow(successText) {
  if (state.view === 'error') { toast('提交失败，请重试'); return false; }
  closeDrawer();
  toast(successText);
  renderPage();
  return true;
}
function confirmDanger(title, desc, onOk) {
  openModal('<h3>' + title + '</h3><p class="page-desc" style="margin:10px 0 16px">' + desc + '</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn secondary" id="cancel-modal">取消</button><button class="btn danger" id="ok-modal">确认</button></div>');
  $('cancel-modal').onclick = closeModal;
  $('ok-modal').onclick = function() { closeModal(); onOk(); };
}
function crudBar(addText) {
  return '<div class="filters">' + operatorSelect() + '<label class="field"><span>关键词</span><input id="q" value="' + state.query + '" placeholder="搜索"></label><button class="btn" id="btn-search">查询</button><button class="btn secondary" id="btn-reset-filter">重置</button><button class="btn" id="btn-add" data-rule-id="R-006">' + addText + ' ' + mark('R-006') + '</button></div>';
}
function tabs(id, items) {
  const cur = state.tab[id] || items[0].id;
  return '<div class="tabs" data-rule-id="R-012">' + items.map(t => '<button class="tab ' + (cur === t.id ? 'active' : '') + '" data-tab-group="' + id + '" data-tab="' + t.id + '">' + t.name + '</button>').join('') + mark('R-012') + '</div>';
}
function simpleList(desc, add, headers, rows) {
  return '<p class="page-desc">' + desc + '</p>' + crudBar(add) + '<div class="card">' + table(headers, rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}

function renderDashboard() {
  const kpis = DEMO.dashboard.kpis.map(k => '<button class="card kpi" data-page="' + k.page + '" data-rule-id="R-003"><div class="label">' + k.label + '</div><div class="value">' + k.value + '</div><div class="sub">' + k.sub + '</div></button>').join('');
  return '<p class="page-desc">用于展示当前系统中的统计数据、统计报表及重要实时数据。' + mark('R-004') + '</p><div class="kpi-grid">' + kpis + '</div><div class="chart-grid"><div class="card chart-card"><h3>最近 7 天注册趋势</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>奖励与提现对比</h3><canvas id="c2"></canvas></div></div>';
}
function afterDashboard() {
  drawLine($('c1'), DEMO.days, [[0,0,0,0,3,0,0]], ['#2f6bff']);
  drawBars($('c2'), ['个人奖励','团队奖励','个人提现','团队提现'], [165,118,33,71], '#0f9f6e');
}
function renderOps() {
  const rows = DEMO.opsRows.filter(matchQuery).map(r => [r.date, r.newUsers, r.bind + '人', r.dau, r.personal, r.team, r.ads]);
  return '<p class="page-desc">按天查看新增用户、团队和广告费数据，默认展示最近 7 天。</p>' + filterBar('搜索日期或指标') + '<div class="kpi-grid"><div class="card kpi"><div class="label">总用户数</div><div class="value">1,700</div></div><div class="card kpi"><div class="label">今日活跃</div><div class="value">1</div></div><div class="card kpi"><div class="label">个人奖励</div><div class="value">₹165,661</div></div><div class="card kpi"><div class="label">总广告费</div><div class="value">₹104,530</div></div></div><div class="chart-grid" data-rule-id="R-004"><div class="card chart-card"><h3>新增用户 / DAU</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>奖励与广告费</h3><canvas id="c2"></canvas></div></div><div class="card table-card"><h3>日期统计</h3>' + table(['日期','新增用户','客服绑定','DAU','个人奖励','团队奖励','广告费'], rows) + '</div>';
}
function afterOps() {
  if (!$('c1')) return;
  drawLine($('c1'), DEMO.days, [DEMO.opsRows.map(r => r.newUsers).reverse(), DEMO.opsRows.map(r => r.dau).reverse()], ['#2f6bff','#0f9f6e']);
  drawBars($('c2'), ['10-10','10-12','10-13'], [5000,1800,200], '#d97706');
}
function renderRetention() {
  const rows = DEMO.retentionRows.filter(matchQuery).map(r => [r.date, r.operator, r.register, r.d1, r.d2, r.d3, r.d7]);
  return '<p class="page-desc">最多查询 7 天；D1 为注册次日，单元格展示活跃人数和占比。</p>' + filterBar('搜索运营商或日期') + '<div class="card chart-card" data-rule-id="R-004"><h3>D1-D7 留存率</h3><canvas id="c1"></canvas></div><div class="card table-card"><h3>留存明细</h3>' + table(['注册日期','运营商','当天注册','D1','D2','D3','D7'], rows) + '</div>';
}
function afterRetention() { if ($('c1')) drawLine($('c1'), ['D1','D2','D3','D4','D5','D6','D7'], [[33,25,17,15,12,10,8]], ['#7c3aed']); }
function renderPartner() {
  const rows = DEMO.partnerRows.filter(matchQuery).map(r => [r.date, r.product, r.register, r.recharge, r.amount, r.withdraw, r.profit]);
  return '<p class="page-desc">基于第三方事件事实表计算，收益=充值金额-奖励金额-提现金额。</p>' + filterBar('搜索产品或日期') + '<div class="chart-grid"><div class="card chart-card"><h3>注册 / 充值趋势</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>收益对比</h3><canvas id="c2"></canvas></div></div><div class="card table-card">' + table(['统计日期','产品','注册数','充值人数','充值金额','提现金额','收益'], rows) + '</div>';
}
function afterPartner() {
  if (!$('c1')) return;
  drawLine($('c1'), ['10-10','10-11','10-12'], [[9,11,18],[2,4,6]], ['#2f6bff','#0f9f6e']);
  drawBars($('c2'), ['UMoney','BC567','AF.GAME'], [4200,1500,700], '#0f9f6e');
}
function renderIncentiveReport() {
  const rows = DEMO.incentiveRows.filter(matchQuery).map(r => [r.operator, r.title, r.cycle, r.window, r.type, r.join + '人', r.reach + '人', r.reward]);
  return '<p class="page-desc">用于运营查看跨活动、跨周期的达标表现与已发奖励分布。</p>' + filterBar('搜索活动') + '<div class="kpi-grid"><div class="card kpi"><div class="label">已发奖励总额</div><div class="value">₹22,320</div></div><div class="card kpi"><div class="label">总邀请人数</div><div class="value">324</div></div><div class="card kpi"><div class="label">总一级提现</div><div class="value">₹79,170</div></div><div class="card kpi"><div class="label">总团队收益</div><div class="value">₹294,643</div></div></div><div class="card chart-card"><h3>参与 / 达标 / 已发奖励</h3><canvas id="c1"></canvas></div><div class="card table-card">' + table(['运营商','活动','刷新周期','统计窗口','达标类型','参与','达标','已发奖励'], rows, function(){ return '<button class="btn ghost" data-act="detail">查看明细</button>'; }) + '</div>';
}
function afterIncentive() { if ($('c1')) drawBars($('c1'), ['参与','达标','奖励(百)'], [6,1,21], '#2f6bff'); }

function renderUsers() {
  const rows = DEMO.users.filter(matchQuery).map(u => [u.name, u.parent, u.code, u.mobile, u.source, u.channel, u.personal, u.team, '<span class="status ' + statusClass(u.status) + '">' + u.status + '</span>', u.operator]);
  return '<p class="page-desc">管理平台用户、状态和钱包信息。' + mark('R-013') + '</p>' + crudBar('新增用户') + '<div class="card">' + table(['昵称','上级','用户编号','手机号','来源','渠道','个人钱包','团队钱包','状态','运营商'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="ledger">流水</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderTeams() {
  const tab = state.tab.teams || 'team';
  if (tab === 'level') {
    const rows = DEMO.teamLevels.filter(matchQuery).map(l => [l.name, l.minMembers, l.bonus, '<span class="status ' + statusClass(l.status) + '">' + l.status + '</span>']);
    return tabs('teams', [{id:'team',name:'团队列表'},{id:'level',name:'团队等级'}]) + crudBar('新增等级') + '<div class="card">' + table(['等级','最低人数','加成','状态'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
  }
  const rows = DEMO.teams.filter(matchQuery).map(t => [t.name, t.leader, t.members, t.level, '<span class="status ' + statusClass(t.status) + '">' + t.status + '</span>']);
  return tabs('teams', [{id:'team',name:'团队列表'},{id:'level',name:'团队等级'}]) + crudBar('新增团队') + '<div class="card">' + table(['团队','团长','人数','等级','状态'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderStaff() {
  const tab = state.tab.staff || 'staff';
  const map = {
    staff: { add:'新增员工', headers:['姓名','岗位','运营商','状态'], rows: DEMO.staff.filter(matchQuery).map(s => [s.name,s.role,s.operator,'<span class="status ' + statusClass(s.status) + '">' + s.status + '</span>']) },
    salary: { add:'新增工资', headers:['员工','月份','基本工资','KPI','合计','状态'], rows: DEMO.salary.filter(matchQuery).map(s => [s.staff,s.month,s.base,s.kpi,s.total,'<span class="status ' + statusClass(s.status) + '">' + s.status + '</span>']) },
    kpi: { add:'新增KPI', headers:['员工','目标','实际','完成率','月份'], rows: DEMO.kpi.filter(matchQuery).map(s => [s.staff,s.target,s.actual,s.rate,s.month]) }
  };
  const cur = map[tab];
  return tabs('staff', [{id:'staff',name:'员工'},{id:'salary',name:'工资'},{id:'kpi',name:'KPI'}]) + crudBar(cur.add) + '<div class="card">' + table(cur.headers, cur.rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderNovice() { return simpleList('按运营商配置新手任务。', '新增任务', ['运营商','任务标识','标题','达标金额','奖励','自动完成','状态'], DEMO.novice.filter(matchQuery).map(n => [n.operator,n.key,n.title,n.goal,n.reward,n.auto,'<span class="status ' + statusClass(n.status) + '">' + n.status + '</span>'])); }
function renderRankActivity() { return simpleList('配置排行活动周期。', '新增活动', ['活动','周期','运营商','状态'], DEMO.rankActivity.filter(matchQuery).map(a => [a.title,a.cycle,a.operator,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>'])); }
function renderRankReward() { return simpleList('配置榜单名次奖励。', '新增奖励', ['活动','名次','奖励','钱包'], DEMO.rankReward.filter(matchQuery).map(a => [a.activity,a.rank,a.reward,a.wallet])); }
function renderIncentiveConfig() { return simpleList('配置推广激励规则。', '新增激励', ['标题','刷新周期','达标类型','奖励去向','状态'], DEMO.incentiveConfig.filter(matchQuery).map(a => [a.title,a.cycle,a.type,a.wallet,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>'])); }
function renderProducts() { return simpleList('按运营商切换推广产品。', '添加产品', ['产品','运营商','渠道','状态'], DEMO.products.filter(matchQuery).map(p => [p.name,p.operator,p.channel,'<span class="status ' + statusClass(p.status) + '">' + p.status + '</span>'])); }
function renderWithdraw() {
  const rows = DEMO.withdraw.filter(matchQuery).map(w => [w.id,w.request,w.user,w.operator,w.wallet,w.amount,w.fee,w.actual,w.method,w.account,'<span class="status ' + statusClass(w.status) + '">' + w.status + '</span>']);
  return '<p class="page-desc">处理用户提现队列，支持代付、驳回和状态同步。</p>' + filterBar('搜索请求号 / 用户编号') + '<div class="kpi-grid"><div class="card kpi"><div class="label">待审金额</div><div class="value">₹500</div></div><div class="card kpi"><div class="label">打款中</div><div class="value">₹1,200</div></div><div class="card kpi"><div class="label">已驳回</div><div class="value">₹800</div></div><div class="card kpi"><div class="label">待审笔数</div><div class="value">1</div></div></div><div class="card chart-card" data-rule-id="R-004"><h3>提现状态分布</h3><canvas id="c1"></canvas></div><div class="card">' + table(['ID','请求号','用户编号','运营商','钱包','金额','费用','实际打款','方式','账户','状态'], rows, function(i){ return '<button class="btn ghost" data-act="pay" data-idx="' + i + '">发起代付</button><button class="btn ghost" data-act="reject" data-idx="' + i + '">驳回</button>'; }) + '</div>';
}
function afterWithdraw() { if ($('c1')) drawBars($('c1'), ['待审核','打款中','已驳回'], [1,1,1], '#d97706'); }

function renderPayout() {
  const tab = state.tab.payout || 'method';
  if (tab === 'account') {
    const rows = DEMO.payoutAccounts.filter(matchQuery).map(a => [a.method,a.account,a.merchant,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']);
    return tabs('payout', [{id:'method',name:'提现方式'},{id:'account',name:'提现账户'}]) + crudBar('新增账户') + '<div class="card">' + table(['方式','账户','商户','状态'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
  }
  const rows = DEMO.payoutMethods.filter(matchQuery).map(a => [a.name,a.code,a.min,a.max,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']);
  return tabs('payout', [{id:'method',name:'提现方式'},{id:'account',name:'提现账户'}]) + crudBar('新增方式') + '<div class="card">' + table(['方式','编码','最小金额','最大金额','状态'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderTeamReward() {
  const tab = state.tab.teamReward || 'grant';
  const rows = DEMO.teamRewards.filter(matchQuery).map(a => [a.team,a.amount,a.reason,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']);
  const acts = tab === 'audit'
    ? function(i){ return '<button class="btn ghost" data-act="approve" data-idx="' + i + '">通过</button><button class="btn ghost" data-act="reject" data-idx="' + i + '">驳回</button>'; }
    : function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; };
  return tabs('teamReward', [{id:'grant',name:'发放记录'},{id:'audit',name:'奖励审核'}]) + crudBar(tab === 'audit' ? '批量审核' : '新增发放') + '<div class="card">' + table(['团队','金额','原因','状态'], rows, acts) + '</div>';
}
function renderContentOps() {
  const tab = state.tab.contentOps || 'banner';
  const conf = {
    banner: { add:'新增轮播', headers:['标题','位置','状态'], rows: DEMO.banners.filter(matchQuery).map(a => [a.title,a.pos,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']) },
    popup: { add:'新增弹窗', headers:['标题','触发','状态'], rows: DEMO.popups.filter(matchQuery).map(a => [a.title,a.trigger,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']) },
    message: { add:'新增消息', headers:['标题','受众','状态'], rows: DEMO.messages.filter(matchQuery).map(a => [a.title,a.audience,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']) }
  }[tab];
  return tabs('contentOps', [{id:'banner',name:'活动轮播'},{id:'popup',name:'活动弹窗'},{id:'message',name:'消息通知'}]) + crudBar(conf.add) + '<div class="card">' + table(conf.headers, conf.rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">编辑</button><button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderEventTypes() { return simpleList('管理第三方上报类型。', '新增类型', ['名称','合作方','状态'], DEMO.eventTypes.filter(matchQuery).map(a => [a.name,a.partner,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>'])); }
function renderEventDetails() {
  const rows = DEMO.eventDetails.filter(matchQuery).map(a => [a.id,a.type,a.user,a.product,a.time,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']);
  return '<p class="page-desc">查看上报事件明细，支持筛选。</p>' + filterBar('搜索用户或产品') + '<div class="card">' + table(['ID','类型','用户','产品','时间','状态'], rows) + '</div>';
}
function renderSettings() {
  const tab = state.tab.settings || 'system';
  const forms = {
    system: [['站点名称','siteName', DEMO.settings.siteName], ['时区','timezone', DEMO.settings.timezone], ['币种','currency', DEMO.settings.currency]],
    app: [['应用版本','appVersion', DEMO.settings.appVersion], ['H5 域名','h5Domain', DEMO.settings.h5Domain]],
    site: [['客服入口','support', '启用'], ['维护模式','maintain', '关闭']]
  }[tab];
  return tabs('settings', [{id:'system',name:'系统配置'},{id:'app',name:'应用配置'},{id:'site',name:'站点配置'}]) + '<div class="card form-card"><h3>保存后立即反映到当前页</h3><form id="setting-form" class="form-grid">' + forms.map(f => '<label class="field"><span>' + f[0] + '</span><input name="' + f[1] + '" value="' + f[2] + '"></label>').join('') + '</form><div style="margin-top:12px"><button class="btn" id="btn-save-setting">保存</button></div></div>';
}
function renderAttachments() {
  const rows = DEMO.attachments.filter(matchQuery).map(a => [a.name,a.size,a.time]);
  return '<p class="page-desc">管理上传附件。</p>' + filterBar('搜索文件名') + '<div class="card">' + table(['文件名','大小','时间'], rows, function(i){ return '<button class="btn ghost" data-act="delete" data-idx="' + i + '">删除</button>'; }) + '</div>';
}
function renderProfile() {
  return '<div class="card form-card"><h3>个人资料</h3><form id="profile-form" class="form-grid"><label class="field"><span>账号</span><input name="name" value="' + DEMO.profile.name + '"></label><label class="field"><span>昵称</span><input name="nickname" value="' + DEMO.profile.nickname + '"></label><label class="field full"><span>邮箱</span><input name="email" value="' + DEMO.profile.email + '"></label></form><div style="margin-top:12px"><button class="btn" id="btn-save-profile">保存</button></div></div>';
}
function renderFeedback() {
  const rows = DEMO.feedback.filter(matchQuery).map(a => [a.user,a.content,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>']);
  return '<p class="page-desc">查看和处理产品建议。</p>' + filterBar('搜索建议') + '<div class="card">' + table(['用户','内容','状态'], rows, function(i){ return '<button class="btn ghost" data-act="edit" data-idx="' + i + '">处理</button>'; }) + '</div>';
}
function renderAdmins() { return simpleList('管理后台账号。', '新增管理员', ['账号','角色','状态'], DEMO.admins.filter(matchQuery).map(a => [a.name,a.role,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>'])); }
function renderRoles() { return simpleList('配置角色组权限。', '新增角色', ['角色','人数','菜单范围'], DEMO.roles.filter(matchQuery).map(a => [a.name,a.users,a.menus])); }
function renderMenus() { return simpleList('配置菜单显示规则。', '新增菜单', ['名称','路径','状态'], DEMO.menus.filter(matchQuery).map(a => [a.name,a.path,'<span class="status ' + statusClass(a.status) + '">' + a.status + '</span>'])); }
function renderLogs() {
  const rows = DEMO.logs.filter(matchQuery).map(a => [a.admin,a.action,a.target,a.time]);
  return '<p class="page-desc">只读查看管理员操作日志。</p>' + filterBar('搜索操作') + '<div class="card">' + table(['管理员','动作','对象','时间'], rows) + '</div>';
}

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  ops: renderOps,
  retention: renderRetention,
  partner: renderPartner,
  incentiveReport: renderIncentiveReport,
  users: renderUsers,
  teams: renderTeams,
  staff: renderStaff,
  novice: renderNovice,
  rankActivity: renderRankActivity,
  rankReward: renderRankReward,
  incentiveConfig: renderIncentiveConfig,
  products: renderProducts,
  withdraw: renderWithdraw,
  payout: renderPayout,
  teamReward: renderTeamReward,
  contentOps: renderContentOps,
  eventTypes: renderEventTypes,
  eventDetails: renderEventDetails,
  settings: renderSettings,
  attachments: renderAttachments,
  profile: renderProfile,
  feedback: renderFeedback,
  admins: renderAdmins,
  roles: renderRoles,
  menus: renderMenus,
  logs: renderLogs
};
const PAGE_AFTER = {
  dashboard: afterDashboard,
  ops: afterOps,
  retention: afterRetention,
  partner: afterPartner,
  incentiveReport: afterIncentive,
  withdraw: afterWithdraw
};
function renderRules() {
  $('rules-list').innerHTML = RULES.map(r => '<article class="rule-card" id="rule-' + r.id + '" data-rule-target="' + r.id + '"><div class="rule-id">' + r.id + '</div><h3>' + r.name + '</h3><p><b>适用：</b>' + r.when + '</p><p>' + r.text + '</p></article>').join('');
}
function renderPage() {
  const meta = findPageMeta();
  $('crumb').textContent = meta.group + ' / ' + meta.name;
  $('page-title').textContent = meta.name;
  renderNav();
  $('content').innerHTML = PAGE_RENDERERS[state.page]();
  if (PAGE_AFTER[state.page]) requestAnimationFrame(PAGE_AFTER[state.page]);
  bindPageEvents();
  if (state.highlight) highlightRule(state.highlight, false);
}
function bindPageEvents() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.onclick = function() {
      state.page = el.getAttribute('data-page');
      state.view = 'default';
      state.query = '';
      renderPage();
    };
  });
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.onclick = function() {
      state.tab[el.dataset.tabGroup] = el.dataset.tab;
      renderPage();
    };
  });
  if ($('q')) $('q').oninput = function(e) { state.query = e.target.value; };
  if ($('operator')) $('operator').onchange = function(e) { state.operator = e.target.value; };
  if ($('btn-search')) $('btn-search').onclick = function() {
    state.view = state.view === 'error' ? 'error' : 'loading';
    renderPage();
    setTimeout(function() { if (state.view === 'loading') { state.view = 'default'; renderPage(); } }, 500);
  };
  if ($('btn-reset-filter')) $('btn-reset-filter').onclick = function() {
    state.query = '';
    state.operator = '全部运营商';
    state.view = 'default';
    renderPage();
  };
  if ($('btn-add')) $('btn-add').onclick = function() { openEdit('新增'); };
  if ($('btn-save-setting')) $('btn-save-setting').onclick = function() {
    if (state.view === 'error') return toast('保存失败，请重试');
    toast('配置已保存');
  };
  if ($('btn-save-profile')) $('btn-save-profile').onclick = function() {
    if (state.view === 'error') return toast('保存失败，请重试');
    toast('个人资料已保存');
  };
  document.querySelectorAll('[data-act]').forEach(btn => {
    btn.onclick = function() { handleAct(btn.dataset.act, Number(btn.dataset.idx || 0)); };
  });
}
function openEdit(mode) {
  const fields = [
    { name: 'title', label: '名称', required: true, value: '' },
    { name: 'operator', label: '运营商', type: 'select', options: DEMO.operators, value: 'YLan' }
  ];
  openDrawer(mode + findPageMeta().name, formFields(fields), '<button class="btn secondary" id="drawer-cancel">取消</button><button class="btn" id="drawer-save" data-rule-id="R-008">保存 ' + mark('R-008') + '</button>');
  $('drawer-cancel').onclick = closeDrawer;
  $('drawer-save').onclick = function() {
    if (!validate(fields)) return;
    saveFlow(mode === '新增' ? '已新增并刷新列表' : '已保存并刷新列表');
  };
}
function handleAct(act, idx) {
  if (act === 'edit') return openEdit('编辑');
  if (act === 'detail') {
    openDrawer('激励明细', '<p>该周期参与 6 人，达标 1 人，已发奖励 ₹2,100.00。</p>', '<button class="btn" id="drawer-cancel">关闭</button>');
    $('drawer-cancel').onclick = closeDrawer;
    return;
  }
  if (act === 'ledger') {
    openDrawer('流水记录', '<p>演示流水：2026-10-12 奖励 +₹20.00，提现 -₹0.00。</p>', '<button class="btn" id="drawer-cancel">关闭</button>');
    $('drawer-cancel').onclick = closeDrawer;
    return;
  }
  if (act === 'delete') return confirmDanger('确认删除', '删除后列表立即刷新，该操作为演示。', function() { toast('已删除并刷新列表'); renderPage(); });
  if (act === 'reject') return confirmDanger('确认驳回', '驳回后状态变为已驳回。', function() {
    if (DEMO.withdraw[idx]) DEMO.withdraw[idx].status = '已驳回';
    if (DEMO.teamRewards[idx]) DEMO.teamRewards[idx].status = '已驳回';
    toast('已驳回并刷新列表');
    renderPage();
  });
  if (act === 'pay') {
    if (DEMO.withdraw[idx]) DEMO.withdraw[idx].status = '打款中';
    toast('已发起代付');
    renderPage();
  }
  if (act === 'approve') {
    if (DEMO.teamRewards[idx]) DEMO.teamRewards[idx].status = '已发放';
    toast('已通过并刷新列表');
    renderPage();
  }
}
function highlightRule(id, scrollRule) {
  state.highlight = id;
  document.querySelectorAll('.rule-card').forEach(c => c.classList.toggle('active', c.dataset.ruleTarget === id));
  document.querySelectorAll('[data-rule-id]').forEach(el => el.classList.toggle('highlight', el.getAttribute('data-rule-id') === id));
  const rule = $('rule-' + id);
  const target = document.querySelector('[data-rule-id="' + id + '"]');
  if (scrollRule && rule) rule.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (!scrollRule && target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function bindGlobal() {
  document.body.addEventListener('click', function(e) {
    const markBtn = e.target.closest('[data-rule-id]');
    if (markBtn) highlightRule(markBtn.getAttribute('data-rule-id'), true);
    const card = e.target.closest('[data-rule-target]');
    if (card) highlightRule(card.getAttribute('data-rule-target'), false);
  });
  $('drawer-mask').addEventListener('click', function(e) { if (e.target.id === 'drawer-mask') closeDrawer(); });
  $('modal-mask').addEventListener('click', function(e) { if (e.target.id === 'modal-mask') closeModal(); });
  $('btn-loading').onclick = function() { state.view = 'loading'; renderPage(); };
  $('btn-empty').onclick = function() { state.view = 'empty'; renderPage(); };
  $('btn-error').onclick = function() { state.view = 'error'; renderPage(); };
  $('btn-reset').onclick = function() { state.view = 'default'; state.query = ''; renderPage(); };
}
renderRules();
bindGlobal();
renderPage();
