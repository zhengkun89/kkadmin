const state = {
  page: "dashboard",
  tab: {},
  filters: {},
  operator: "全部运营商",
  operatorChip: "全局默认",
  view: "default",
  highlight: null,
  selected: null
};

const RULES = [
  { id: "R-001", name: "桌面审阅壳层", when: "打开原型", text: "左侧为 1440 桌面后台原型，右侧为规则标注。不包含登录页，直接进入超管后台。" },
  { id: "R-002", name: "业务域菜单", when: "使用左侧导航", text: "菜单按业务域分组，单页切换。Tab 只收拢同类页，不删原有功能。" },
  { id: "R-003", name: "控制台下钻", when: "点击控制台 KPI", text: "KPI 卡片进入对应业务页。" },
  { id: "R-004", name: "数据页补图表", when: "打开数据类页面", text: "控制台、经营数据、留存、第三方事件、激励报表、提现审核保留原表格并增加本地 Canvas 图表。" },
  { id: "R-005", name: "完整筛选", when: "使用搜索/筛选", text: "每页保留现有筛选项。查询、重置、空态、加载态可用。" },
  { id: "R-006", name: "完整字段表单", when: "新增或编辑", text: "抽屉展示该页真实字段，不再使用通用名称表单。" },
  { id: "R-007", name: "必填校验", when: "提交空表单", text: "必填未填时字段旁提示且不提交。" },
  { id: "R-008", name: "成功反馈", when: "保存/审核成功", text: "关闭弹层，刷新列表，顶部成功提示。" },
  { id: "R-009", name: "失败可重试", when: "模拟失败后提交", text: "保留已填内容，页面内提示失败，允许重试。" },
  { id: "R-010", name: "危险操作确认", when: "删除、驳回、测试结算、模拟发放", text: "先确认，取消则不变更。" },
  { id: "R-011", name: "审核状态流转", when: "提现或奖励审核", text: "代付后变为打款中，通过后已完成/已发放，驳回后已驳回/拒绝。" },
  { id: "R-012", name: "同类页 Tab", when: "打开合并页", text: "团队、员工、提现配置、团队奖励、首页运营、平台配置用 Tab 收拢，每个 Tab 保留原功能。" },
  { id: "R-013", name: "演示数据", when: "查看任何列表", text: "演示数据已脱敏，手机号等敏感信息打码。" },
  { id: "R-014", name: "原有操作保留", when: "使用行内或工具栏按钮", text: "流水、明细、事件、预览、代付、同步、模拟发放、导入模板等原有操作均保留。" }
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
  if (["正常","启用","开启","上架","已发放","已打款","已完成","成功","是"].includes(String(v))) return "ok";
  if (["待审核","打款中","待发放","进行中","待处理","草稿"].includes(String(v))) return "warn";
  if (["已驳回","拒绝","停用","下架","隐藏","限制提现","禁用","关闭","代付提交失败","打款失败"].includes(String(v))) return "danger";
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
function openDrawer(title, body, footer) {
  $("drawer").innerHTML = "<h3>" + title + "</h3>" + body + '<div style="display:flex;gap:8px;margin-top:16px">' + footer + "</div>";
  $("drawer-mask").classList.remove("hidden");
  if ($("drawer-cancel")) $("drawer-cancel").onclick = closeDrawer;
}
function closeDrawer() { $("drawer-mask").classList.add("hidden"); }
function openModal(html) {
  $("modal").innerHTML = html;
  $("modal-mask").classList.remove("hidden");
}
function closeModal() { $("modal-mask").classList.add("hidden"); }
function confirmDanger(title, desc, onOk) {
  openModal("<h3>" + title + "</h3><p class=\"page-desc\" style=\"margin:10px 0 16px\">" + desc + '</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn secondary" id="cancel-modal">取消</button><button class="btn danger" id="ok-modal">确认</button></div>');
  $("cancel-modal").onclick = closeModal;
  $("ok-modal").onclick = function() { closeModal(); onOk(); };
}

function drawLine(canvas, labels, series, colors) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 520;
  const h = canvas.clientHeight || 220;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const max = Math.max(1, ...series.flat());
  ctx.strokeStyle = "#e5eaf1";
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, h - pad.b); ctx.lineTo(w - pad.r, h - pad.b); ctx.stroke();
  series.forEach((arr, si) => {
    ctx.strokeStyle = colors[si]; ctx.lineWidth = 2; ctx.beginPath();
    arr.forEach((v, i) => {
      const x = pad.l + i * ((w - pad.l - pad.r) / Math.max(1, arr.length - 1));
      const y = pad.t + (1 - v / max) * (h - pad.t - pad.b);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  ctx.fillStyle = "#94a3b8"; ctx.font = "11px sans-serif";
  labels.forEach((label, i) => ctx.fillText(label, pad.l + i * ((w - pad.l - pad.r) / Math.max(1, labels.length - 1)) - 12, h - 10));
}
function drawBars(canvas, labels, values, color) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 420;
  const h = canvas.clientHeight || 220;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(1, ...values);
  const bw = (w - 50) / values.length - 10;
  values.forEach((v, i) => {
    const x = 36 + i * (bw + 10);
    const bh = (v / max) * (h - 50);
    ctx.fillStyle = color;
    ctx.fillRect(x, h - 28 - bh, bw, bh);
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px sans-serif"; ctx.fillText(labels[i], x, h - 10);
  });
}
function cellHtml(val) {
  const s = String(val ?? "");
  if (["正常","隐藏","待审核","打款中","已打款","已驳回","已完成","拒绝","开启","关闭","成功","待处理","已回复","已发放","待发放","禁用","限制提现"].includes(s)) {
    return '<span class="status ' + statusClass(s) + '">' + s + "</span>";
  }
  return s;
}
function table(headers, rows, actionsHtml) {
  if (state.view === "loading") return '<div class="loading">正在查询演示数据...</div>';
  if (state.view === "error") return '<div class="error-box" data-rule-id="R-009">查询失败，请保留当前条件后重试。' + mark("R-009") + "</div>";
  if (!rows.length || state.view === "empty") return '<div class="empty">没有找到匹配的记录</div>';
  const head = headers.map(h => "<th>" + h + "</th>").join("") + (actionsHtml ? "<th>操作</th>" : "");
  const body = rows.map((row, idx) => "<tr>" + row.map(cell => "<td>" + cellHtml(cell) + "</td>").join("") + (actionsHtml ? '<td class="row-actions">' + actionsHtml(idx) + "</td>" : "") + "</tr>").join("");
  return '<div class="table-wrap"><table><thead><tr>' + head + "</tr></thead><tbody>" + body + '</tbody></table></div><div class="pager"><span>显示第 1 到第 ' + rows.length + " 条，共 " + rows.length + " 条演示记录</span><span>上一页 1 下一页</span></div>";
}
function filterValue(key, fallback) {
  return state.filters[state.page + ":" + (state.tab[state.page] || "") + ":" + key] ?? fallback ?? "";
}
function setFilterValue(key, val) {
  state.filters[state.page + ":" + (state.tab[state.page] || "") + ":" + key] = val;
}
function fieldControl(f, prefix) {
  const name = (prefix || "f_") + f.key;
  const val = filterValue(f.key, f.value || "");
  if (f.type === "select") {
    const opts = (f.options || []).map(o => "<option" + (o === val ? " selected" : "") + ">" + o + "</option>").join("");
    return '<label class="field"><span>' + f.label + '</span><select name="' + name + '" data-filter="' + f.key + '">' + opts + "</select></label>";
  }
  return '<label class="field"><span>' + f.label + '</span><input name="' + name + '" data-filter="' + f.key + '" value="' + val + '" placeholder="' + (f.placeholder || f.label) + '"></label>';
}
function renderFilters(filters, extraBtns) {
  return '<div class="filters" data-rule-id="R-005">' + filters.map(f => fieldControl(f)).join("") + '<button class="btn" id="btn-search">查询 ' + mark("R-005") + '</button><button class="btn secondary" id="btn-reset-filter">重置</button>' + (extraBtns || "") + "</div>";
}
function operatorChips(current) {
  const list = ["全局默认"].concat(DEMO.operatorOnly);
  return '<div class="chip-row">运营商：' + list.map(o => '<button class="chip ' + (current === o ? "active" : "") + '" data-chip="' + o + '">' + o + "</button>").join("") + "</div>";
}
function tabs(id, items) {
  const cur = state.tab[id] || items[0].id;
  return '<div class="tabs" data-rule-id="R-012">' + items.map(t => '<button class="tab ' + (cur === t.id ? "active" : "") + '" data-tab-group="' + id + '" data-tab="' + t.id + '">' + t.name + "</button>").join("") + mark("R-012") + "</div>";
}
function subtabs(id, items) {
  const cur = state.tab[id] || items[0].id;
  return '<div class="subtabs">' + items.map(t => '<button class="subtab ' + (cur === t.id ? "active" : "") + '" data-tab-group="' + id + '" data-tab="' + t.id + '">' + t.name + "</button>").join("") + "</div>";
}
function matchRow(row, filters) {
  return filters.every(f => {
    const val = String(filterValue(f.key, "")).trim();
    if (!val || val === "选择" || val === "全部运营商" || val === "全部") return true;
    if (f.key === "operator" || f.label === "所属运营商") {
      if (state.operator && state.operator !== "全部运营商" && String(row.operator || "") !== state.operator && String(row.operator || "") !== "全局默认") return false;
    }
    const target = String(row[f.key] ?? "");
    return target.toLowerCase().includes(val.toLowerCase());
  });
}
function formFields(fields, row) {
  return '<form id="edit-form" class="form-grid" data-rule-id="R-007">' + fields.map(f => {
    const value = row ? (row[f.key] ?? "") : (f.value || "");
    let control = "";
    if (f.type === "select") control = '<select name="' + f.key + '">' + (f.options || []).map(o => "<option" + (o === value ? " selected" : "") + ">" + o + "</option>").join("") + "</select>";
    else if (f.type === "textarea") control = '<textarea name="' + f.key + '">' + value + "</textarea>";
    else if (f.type === "checks") {
      const selected = String(value).split(/[,/、]/).map(v => v.trim()).filter(Boolean);
      control = '<div class="tree">' + (f.options || []).map(o => '<label><input type="checkbox" name="' + f.key + '" value="' + o + '"' + (selected.includes(o) ? " checked" : "") + ">" + o + "</label>").join("") + "</div>";
    } else if (f.type === "tiers") {
      const list = Array.isArray(row && row.tierList) ? row.tierList : [{ min: "100", reward: "10" }, { min: "500", reward: "50" }];
      control = '<div class="kv-list" id="tier-list">' + list.map(t => '<div class="kv"><input name="tier_min" value="' + t.min + '" placeholder="达标金额"><input name="tier_reward" value="' + t.reward + '" placeholder="奖励"><button type="button" class="ghost-btn" data-remove-tier>x</button></div>').join("") + '</div><button type="button" class="btn secondary" id="btn-add-tier-row">追加档位</button>';
    } else control = '<input name="' + f.key + '" value="' + value + '">';
    return '<label class="field ' + (f.full ? "full" : "") + '"><span>' + f.label + (f.required ? " *" : "") + "</span>" + control + '<div class="field-error" data-error-for="' + f.key + '"></div></label>';
  }).join("") + "</form>";
}
function validate(fields) {
  let ok = true;
  fields.forEach(f => {
    if (!f.required) return;
    const input = document.querySelector('[name="' + f.key + '"]');
    const err = document.querySelector('[data-error-for="' + f.key + '"]');
    if (!input || !String(input.value).trim()) { if (err) err.textContent = "请填写" + f.label; ok = false; }
    else if (err) err.textContent = "";
  });
  return ok;
}
function exportBtn() {
  return '<div class="export-wrap"><button class="btn secondary" id="btn-export">导出</button><div class="menu-pop" id="export-menu"><button data-export="CSV">CSV</button><button data-export="Excel">MS-Excel</button><button data-export="JSON">JSON</button></div></div>';
}

const OP = ["选择"].concat(DEMO.operatorOnly);
const OP_ALL = ["全部运营商"].concat(DEMO.operatorOnly);
const OP_G = ["选择","全局默认"].concat(DEMO.operatorOnly);

function listPage(cfg) {
  let source = (typeof cfg.data === "function" ? cfg.data() : DEMO[cfg.dataKey] || []); if (cfg.chips) source = source.filter(function(r){ return !r.operator || r.operator === state.operatorChip || (state.operatorChip === "全局默认" && r.operator === "全局默认"); }); const rowsAll = source.filter(r => matchRow(r, cfg.filters || []));
  const rows = rowsAll.map(r => (cfg.columns || []).map(c => r[c.key]));
  const toolbar = (cfg.toolbar || []).map(b => '<button class="btn ' + (b.danger ? "danger" : "") + '" data-tool="' + b.act + '">' + b.label + "</button>").join("");
  const chips = cfg.chips ? operatorChips(state.operatorChip) : "";
  const acts = function(i) {
    return (cfg.rowActions || []).map(a => '<button class="btn ghost" data-act="' + a.act + '" data-idx="' + i + '">' + a.label + "</button>").join("");
  };
  return (cfg.desc ? '<p class="page-desc">' + cfg.desc + " " + (cfg.rule ? mark(cfg.rule) : "") + "</p>" : "") + chips + renderFilters(cfg.filters || [], toolbar + (cfg.export !== false ? exportBtn() : "")) + (cfg.beforeTable || "") + '<div class="card">' + table((cfg.columns || []).map(c => c.label), rows, cfg.rowActions ? acts : null) + "</div>";
}

const FORMS = {
  user: [
    { key:"name", label:"昵称", required:true },
    { key:"code", label:"用户编号", required:true },
    { key:"mobile", label:"手机号", required:true },
    { key:"parent", label:"上级" },
    { key:"android", label:"安卓ID" },
    { key:"upi", label:"UPI Pay UID" },
    { key:"source", label:"用户来源", type:"select", options:["买量","裂变","自然","OAuth","Test"] },
    { key:"channel", label:"渠道" },
    { key:"pBal", label:"个人钱包余额" },
    { key:"tBal", label:"团队钱包余额" },
    { key:"status", label:"状态", type:"select", options:["正常","限制提现","隐藏"] },
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly }
  ],
  teamLevel: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局默认"].concat(DEMO.operatorOnly), required:true },
    { key:"name", label:"等级", required:true },
    { key:"value", label:"等级值", required:true },
    { key:"range", label:"团队累计提现区间" },
    { key:"p1", label:"一级比例" },
    { key:"p2", label:"二级比例" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  staff: [
    { key:"name", label:"员工姓名", required:true },
    { key:"mobile", label:"手机号", required:true },
    { key:"tg", label:"Telegram" },
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly, required:true },
    { key:"link", label:"邀请链接", full:true }
  ],
  salary: [
    { key:"staff", label:"员工", required:true },
    { key:"month", label:"月份", required:true },
    { key:"base", label:"基本工资" },
    { key:"kpi", label:"KPI" },
    { key:"total", label:"合计" },
    { key:"status", label:"状态", type:"select", options:["待审核","已发放"] }
  ],
  kpi: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局"].concat(DEMO.operatorOnly), required:true },
    { key:"cycle", label:"考核周期", type:"select", options:["本周","本月"], required:true },
    { key:"invite", label:"邀请人数" },
    { key:"rebate", label:"返佣金额" },
    { key:"wdUsers", label:"总提现人数" },
    { key:"pUsers", label:"个人提现人数" },
    { key:"tUsers", label:"团队提现人数" },
    { key:"wdAmt", label:"总提现金额" },
    { key:"pAmt", label:"个人提现金额" },
    { key:"tAmt", label:"团队提现金额" },
    { key:"firstTask", label:"三方产品完成首次任务人数" },
    { key:"partnerWd", label:"三方产品完成提现人数" }
  ],
  novice: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局默认"].concat(DEMO.operatorOnly), required:true },
    { key:"key", label:"任务标识", required:true },
    { key:"title", label:"任务标题", required:true },
    { key:"goal", label:"达标金额" },
    { key:"reward", label:"奖励金额" },
    { key:"auto", label:"自动完成", type:"select", options:["否","是"] },
    { key:"inviteRel", label:"激活邀请关系", type:"select", options:["否","是"] },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  rankActivity: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局默认"].concat(DEMO.operatorOnly), required:true },
    { key:"title", label:"活动名称", required:true },
    { key:"cycle", label:"计算周期", type:"select", options:["日","周","月"] },
    { key:"weight", label:"权重" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  incentive: [
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly, required:true },
    { key:"cycle", label:"周期", type:"select", options:["日","周","月"] },
    { key:"title", label:"活动标题", required:true },
    { key:"wallet", label:"奖励去向", type:"select", options:["个人钱包","团队钱包"] },
    { key:"type", label:"达标类型", type:"select", options:["一级用户个人提现","团队收益"] },
    { key:"weight", label:"权重" },
    { key:"enabled", label:"总开关", type:"select", options:["开启","关闭"] },
    { key:"tierList", label:"档位配置", type:"tiers", full:true }
  ],
  product: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局默认"].concat(DEMO.operatorOnly), required:true },
    { key:"name", label:"Name (EN)", required:true },
    { key:"type", label:"类型", type:"select", options:["游戏","应用"] },
    { key:"vis", label:"可见范围", type:"select", options:["所有用户","测试账号"] },
    { key:"access", label:"接入方式", type:"select", options:["自有","Adjust"] },
    { key:"code", label:"第三方产品编码" },
    { key:"weight", label:"权重" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  payoutMethod: [
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly, required:true },
    { key:"code", label:"方式编码", required:true },
    { key:"name", label:"方式名称", required:true },
    { key:"min", label:"最小金额" },
    { key:"max", label:"最大金额" },
    { key:"weight", label:"权重" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  payoutAccount: [
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly },
    { key:"code", label:"用户编号", required:true },
    { key:"name", label:"昵称" },
    { key:"method", label:"方式编码" },
    { key:"accountName", label:"账户名" },
    { key:"bankNo", label:"银行卡账号" },
    { key:"def", label:"默认", type:"select", options:["否","是"] },
    { key:"status", label:"状态", type:"select", options:["正常","禁用"] }
  ],
  teamReward: [
    { key:"user", label:"用户编号", required:true },
    { key:"type", label:"类型", type:"select", options:["推广费用","补偿","激励奖励","其他"] },
    { key:"amount", label:"奖励金额", required:true },
    { key:"status", label:"状态", type:"select", options:["待审核","已完成","拒绝"] }
  ],
  banner: [
    { key:"operator", label:"所属运营商", type:"select", options:["全局默认"].concat(DEMO.operatorOnly) },
    { key:"title", label:"标题", required:true },
    { key:"pos", label:"位置" },
    { key:"link", label:"跳转链接", full:true },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  popup: [
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly },
    { key:"title", label:"标题", required:true },
    { key:"link", label:"跳转链接", full:true },
    { key:"daily", label:"每日次数" },
    { key:"interval", label:"间隔(分钟)" },
    { key:"start", label:"开始时间" },
    { key:"end", label:"结束时间" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  message: [
    { key:"operator", label:"所属运营商", type:"select", options:DEMO.operatorOnly },
    { key:"type", label:"类型", type:"select", options:["系统消息","福利消息","签到活动"] },
    { key:"title", label:"标题", required:true },
    { key:"link", label:"跳转链接", full:true },
    { key:"time", label:"发布时间" },
    { key:"weight", label:"权重" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  eventType: [
    { key:"name", label:"名称", required:true },
    { key:"partner", label:"合作方" },
    { key:"code", label:"事件编码" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  admin: [
    { key:"name", label:"用户名", required:true },
    { key:"nickname", label:"昵称" },
    { key:"groups", label:"角色组", type:"checks", options:["超级管理员","运营"], full:true },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  role: [
    { key:"name", label:"角色组", required:true },
    { key:"parent", label:"上级角色" },
    { key:"perms", label:"权限勾选", type:"checks", options:["控制台","经营数据","用户管理","团队管理","提现审核","激励配置","推广产品","平台配置","管理员","角色组","菜单规则"], full:true }
  ],
  attachment: [
    { key:"name", label:"文件名", required:true },
    { key:"cat", label:"分类", type:"select", options:["未归类","分类一","分类二","自定义"] },
    { key:"type", label:"类型", type:"select", options:["图片","音频","视频","文档","应用","压缩包"] }
  ],
  menu: [
    { key:"name", label:"名称", required:true },
    { key:"path", label:"路径", required:true },
    { key:"parent", label:"父级" },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  app: [
    { key:"platform", label:"平台", type:"select", options:["Android","iOS"] },
    { key:"version", label:"版本", required:true },
    { key:"force", label:"强制更新", type:"select", options:["否","是"] },
    { key:"note", label:"说明", full:true },
    { key:"status", label:"状态", type:"select", options:["正常","隐藏"] }
  ],
  feedback: [
    { key:"status", label:"处理状态", type:"select", options:["待处理","已回复"] },
    { key:"content", label:"回复内容", type:"textarea", full:true, required:true }
  ]
};

function currentListConfig() {
  const page = state.page;
  const tab = state.tab[page];
  if (page === "users") return {
    desc:"管理平台用户、状态、钱包和流水。", rule:"R-013", dataKey:"users", form:"user", formTitle:"用户",
    filters:[
      { key:"id", label:"用户ID" }, { key:"name", label:"昵称" }, { key:"code", label:"用户编号" }, { key:"mobile", label:"手机号" },
      { key:"android", label:"安卓ID" }, { key:"time", label:"注册时间" },
      { key:"source", label:"用户来源", type:"select", options:["选择","买量","裂变","自然","OAuth","Test"] },
      { key:"channel", label:"渠道", type:"select", options:["选择","facebook","facebook1","growth_reward_test","yunying"] },
      { key:"pBal", label:"个人钱包余额" }, { key:"tBal", label:"团队钱包余额" },
      { key:"status", label:"状态", type:"select", options:["选择","正常","限制提现","隐藏"] },
      { key:"operator", label:"所属运营商", type:"select", options:OP }
    ],
    columns:[
      { key:"name", label:"昵称" }, { key:"parent", label:"上级" }, { key:"code", label:"用户编号" }, { key:"mobile", label:"手机号" },
      { key:"android", label:"安卓ID" }, { key:"upi", label:"UPI Pay UID" }, { key:"time", label:"注册时间" }, { key:"source", label:"用户来源" },
      { key:"channel", label:"渠道" }, { key:"links", label:"产品链接统计" }, { key:"pBal", label:"个人钱包余额" }, { key:"pWd", label:"个人提现总额" },
      { key:"promo", label:"推广产品总奖励" }, { key:"eq", label:"等于奖励" }, { key:"pct", label:"百分比奖励" }, { key:"tBal", label:"团队钱包余额" },
      { key:"tWd", label:"团队提现总额" }, { key:"totalWd", label:"总提现" }, { key:"status", label:"状态" }, { key:"operator", label:"所属运营商" }
    ],
    toolbar:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"resetWhitelist", label:"重置白名单测试账号" }, { act:"setNormal", label:"设为正常" }, { act:"setHidden", label:"设为隐藏" }],
    rowActions:[{ act:"ledger", label:"流水记录" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "teams" && tab === "level") return {
    desc:"配置团队等级与分佣比例。", dataKey:"teamLevels", form:"teamLevel", formTitle:"团队等级",
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"name", label:"等级" }, { key:"value", label:"等级值" },
      { key:"p1", label:"一级比例" }, { key:"p2", label:"二级比例" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"name", label:"等级" }, { key:"value", label:"等级值" }, { key:"range", label:"团队累计提现区间" }, { key:"p1", label:"一级比例" }, { key:"p2", label:"二级比例" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "teams") return {
    desc:"查看团队规模、贡献、提现和发放明细。", dataKey:"teams",
    filters:[
      { key:"leaderId", label:"队长ID" }, { key:"code", label:"队长编号" }, { key:"invite", label:"队长邀请码" }, { key:"mobile", label:"手机号" },
      { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"level", label:"团队等级", type:"select", options:["选择","L1","L2","L3","L4"] }, { key:"time", label:"时间筛选" }
    ],
    columns:[
      { key:"id", label:"团队ID" }, { key:"leaderId", label:"队长ID" }, { key:"leader", label:"队长昵称" }, { key:"invite", label:"队长邀请码" }, { key:"mobile", label:"手机号" },
      { key:"operator", label:"所属运营商" }, { key:"level", label:"团队等级" }, { key:"members", label:"成员总数/一级/二级" }, { key:"active", label:"活跃度" },
      { key:"contrib", label:"成员总贡献/一级/二级" }, { key:"memberWd", label:"成员累计总提现/一级/二级" }, { key:"earn", label:"团队赚取" }, { key:"leaderWd", label:"队长提现" },
      { key:"real", label:"真实收益(拉新奖励/提现返佣)" }, { key:"grant", label:"活动发放/人工发放" }
    ],
    rowActions:[{ act:"teamIncome", label:"团队收益明细" }, { act:"teamView", label:"查看" }, { act:"productDetail", label:"产品推广明细" }]
  };
  if (page === "staff" && (tab === "salary")) return {
    desc:"员工工资单，支持刷新进度、审核发放和导入。", dataKey:"salary", form:"salary", formTitle:"工资单",
    filters:[{ key:"staff", label:"员工" }, { key:"month", label:"月份" }, { key:"status", label:"状态", type:"select", options:["选择","待审核","已发放"] }],
    columns:[{ key:"staff", label:"员工" }, { key:"month", label:"月份" }, { key:"cycle", label:"周期" }, { key:"base", label:"基本工资" }, { key:"kpi", label:"KPI" }, { key:"total", label:"合计" }, { key:"progress", label:"进度" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"delete", label:"删除" }, { act:"refreshProgress", label:"刷新进度" }, { act:"auditPay", label:"审核发放" }, { act:"import", label:"导入" }, { act:"downloadTemplate", label:"下载模板" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "staff" && tab === "kpi") return {
    desc:"配置员工考核指标。", dataKey:"kpi", formTitle:"KPI", form:"kpi",
    filters:[
      { key:"operator", label:"所属运营商", type:"select", options:["选择","全局"].concat(DEMO.operatorOnly) }, { key:"cycle", label:"考核周期", type:"select", options:["选择","本周","本月"] },
      { key:"invite", label:"邀请人数" }, { key:"rebate", label:"返佣金额" }, { key:"wdUsers", label:"总提现人数" }, { key:"pUsers", label:"个人提现人数" }, { key:"tUsers", label:"团队提现人数" }
    ],
    columns:[{ key:"operator", label:"所属运营商" }, { key:"cycle", label:"考核周期" }, { key:"invite", label:"邀请人数" }, { key:"rebate", label:"返佣金额" }, { key:"wdUsers", label:"总提现人数" }, { key:"pUsers", label:"个人提现人数" }, { key:"tUsers", label:"团队提现人数" }, { key:"wdAmt", label:"总提现金额" }, { key:"pAmt", label:"个人提现金额" }, { key:"tAmt", label:"团队提现金额" }, { key:"firstTask", label:"三方产品完成首次任务人数" }, { key:"partnerWd", label:"三方产品完成提现人数" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "staff") return {
    desc:"管理员工邀请链接、绑定用户和提现表现。", dataKey:"staff", form:"staff", formTitle:"员工",
    filters:[{ key:"name", label:"员工姓名" }, { key:"mobile", label:"手机号" }, { key:"tg", label:"Telegram" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"time", label:"创建时间" }],
    columns:[{ key:"id", label:"ID" }, { key:"name", label:"员工姓名" }, { key:"mobile", label:"手机号" }, { key:"link", label:"邀请链接" }, { key:"tg", label:"Telegram" }, { key:"operator", label:"所属运营商" }, { key:"bindUser", label:"绑定用户" }, { key:"selfInvite", label:"本产品邀请人数" }, { key:"partnerInvite", label:"三方产品邀请人数" }, { key:"rebate", label:"产品返佣" }, { key:"kpi", label:"KPI完成度" }, { key:"pWd", label:"个人提现金额" }, { key:"tWd", label:"团队提现金额" }, { key:"time", label:"创建时间" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  return null;
}

function extraListConfig() {
  const page = state.page;
  const tab = state.tab[page];
  if (page === "novice") return {
    desc:"按运营商配置新手任务。", dataKey:"novice", form:"novice", chips:true,
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP_G }, { key:"key", label:"任务标识" }, { key:"title", label:"任务标题" },
      { key:"goal", label:"达标金额" }, { key:"reward", label:"奖励金额" }, { key:"auto", label:"自动完成", type:"select", options:["选择","否","是"] },
      { key:"inviteRel", label:"激活邀请关系", type:"select", options:["选择","否","是"] }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"key", label:"任务标识" }, { key:"title", label:"任务标题" }, { key:"goal", label:"达标金额" }, { key:"reward", label:"奖励金额" }, { key:"auto", label:"自动完成" }, { key:"inviteRel", label:"激活邀请关系" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "rankActivity") return {
    desc:"配置排行活动周期，并支持测试结算。", dataKey:"rankActivity", form:"rankActivity", chips:true,
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP_G }, { key:"title", label:"活动名称" },
      { key:"cycle", label:"计算周期", type:"select", options:["选择","日","周","月"] }, { key:"weight", label:"权重" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"title", label:"活动名称" }, { key:"cycle", label:"计算周期" }, { key:"weight", label:"权重" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"settleWeek", label:"测试结算当前周" }, { act:"settleMonth", label:"测试结算当前月" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "incentiveConfig") return {
    desc:"配置推广激励规则和档位。", dataKey:"incentiveConfig", form:"incentive",
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"cycle", label:"周期", type:"select", options:["选择","日","周","月"] },
      { key:"title", label:"活动标题" }, { key:"enabled", label:"总开关", type:"select", options:["选择","关闭","开启"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"cycle", label:"周期" }, { key:"title", label:"活动标题" }, { key:"tiers", label:"档位数" }, { key:"summary", label:"档位摘要" }, { key:"weight", label:"权重" }, { key:"enabled", label:"总开关" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"simulateGrant", label:"模拟发放" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "products") return {
    desc:"按运营商切换推广产品，支持事件和预览。", dataKey:"products", form:"product", chips:true,
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP_G }, { key:"name", label:"Name (EN)" },
      { key:"type", label:"类型", type:"select", options:["选择","游戏","应用"] }, { key:"vis", label:"可见范围", type:"select", options:["选择","所有用户","测试账号"] },
      { key:"access", label:"接入方式", type:"select", options:["选择","自有","Adjust"] }, { key:"code", label:"第三方产品编码" }, { key:"grant", label:"累计发放" }, { key:"weight", label:"权重" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"icon", label:"Icon" }, { key:"name", label:"Name (EN)" }, { key:"type", label:"类型" }, { key:"vis", label:"可见范围" }, { key:"access", label:"接入方式" }, { key:"code", label:"第三方产品编码" }, { key:"grant", label:"累计发放" }, { key:"weight", label:"权重" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"productEvent", label:"事件" }, { act:"productPreview", label:"预览" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "withdraw") return {
    desc:"处理用户提现队列，支持代付、驳回和状态同步。", dataKey:"withdraw",
    filters:[
      { key:"id", label:"ID" }, { key:"request", label:"请求号" }, { key:"user", label:"用户编号" }, { key:"userId", label:"用户ID" },
      { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"wallet", label:"钱包类型", type:"select", options:["选择","个人","团队"] },
      { key:"amount", label:"提现金额" }, { key:"method", label:"方式编码" }, { key:"account", label:"提现账户" },
      { key:"status", label:"状态", type:"select", options:["选择","待审核","代付提交失败","打款中","已打款","打款失败","已驳回"] },
      { key:"channelNo", label:"通道订单号" }, { key:"utr", label:"UTR" }, { key:"time", label:"创建时间" }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"request", label:"请求号" }, { key:"user", label:"用户编号" }, { key:"operator", label:"所属运营商" }, { key:"wallet", label:"钱包类型" }, { key:"amount", label:"提现金额" }, { key:"fee", label:"扣除费用" }, { key:"actual", label:"实际打款金额" }, { key:"method", label:"方式编码" }, { key:"accountId", label:"账户ID" }, { key:"account", label:"提现账户" }, { key:"status", label:"状态" }, { key:"collect", label:"归集统计金额" }, { key:"channelNo", label:"通道订单号" }, { key:"utr", label:"UTR" }, { key:"time", label:"创建时间" }],
    toolbar:[{ act:"pay", label:"发起代付" }, { act:"reject", label:"驳回" }, { act:"sync", label:"同步代付状态" }],
    rowActions:[{ act:"pay", label:"发起代付" }, { act:"reject", label:"驳回" }, { act:"sync", label:"同步代付状态" }],
    beforeTable:'<div class="kpi-grid"><div class="card kpi"><div class="label">待审金额</div><div class="value">₹500</div></div><div class="card kpi"><div class="label">打款中</div><div class="value">₹1,200</div></div><div class="card kpi"><div class="label">已驳回</div><div class="value">₹800</div></div><div class="card kpi"><div class="label">待审笔数</div><div class="value">1</div></div></div><div class="card chart-card" data-rule-id="R-004"><h3>提现状态分布</h3><canvas id="c1"></canvas></div>'
  };
  if (page === "payout" && tab === "account") return {
    desc:"管理用户提现账户，不是商户通道账户。", dataKey:"payoutAccounts", form:"payoutAccount",
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"code", label:"用户编号" }, { key:"userId", label:"用户ID" }, { key:"name", label:"昵称" },
      { key:"method", label:"方式编码" }, { key:"accountName", label:"账户名" }, { key:"bankNo", label:"银行卡账号" }, { key:"ok", label:"提现成功次数" }, { key:"fail", label:"提现失败次数" },
      { key:"def", label:"默认", type:"select", options:["选择","否","是"] }, { key:"status", label:"状态", type:"select", options:["选择","正常","禁用"] }, { key:"time", label:"创建时间" }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"code", label:"用户编号" }, { key:"name", label:"昵称" }, { key:"method", label:"方式编码" }, { key:"accountName", label:"账户名" }, { key:"bankNo", label:"银行卡账号" }, { key:"ok", label:"提现成功次数" }, { key:"fail", label:"提现失败次数" }, { key:"def", label:"默认" }, { key:"status", label:"状态" }, { key:"time", label:"创建时间" }],
    toolbar:[{ act:"edit", label:"编辑" }],
    rowActions:[{ act:"edit", label:"编辑" }]
  };
  if (page === "payout") return {
    desc:"配置提现方式编码、限额和权重。", dataKey:"payoutMethods", form:"payoutMethod",
    filters:[
      { key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"code", label:"方式编码" }, { key:"name", label:"方式名称" },
      { key:"min", label:"最小金额" }, { key:"max", label:"最大金额" }, { key:"weight", label:"权重" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }
    ],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"code", label:"方式编码" }, { key:"name", label:"方式名称" }, { key:"min", label:"最小金额" }, { key:"max", label:"最大金额" }, { key:"weight", label:"权重" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  return null;
}

function moreListConfig() {
  const page = state.page;
  const tab = state.tab[page];
  if (page === "teamReward" && tab === "audit") return {
    desc:"审核团队奖励发放申请。", dataKey:"teamRewards", form:"teamReward",
    filters:[
      { key:"user", label:"用户编号" }, { key:"type", label:"类型", type:"select", options:["选择","推广费用","补偿","激励奖励","其他"] },
      { key:"status", label:"状态", type:"select", options:["选择","待审核","已完成","拒绝"] }, { key:"amount", label:"奖励金额" }, { key:"applyTime", label:"申请时间" }, { key:"auditTime", label:"审核时间" }
    ],
    columns:[{ key:"user", label:"用户编号" }, { key:"type", label:"类型" }, { key:"status", label:"状态" }, { key:"amount", label:"奖励金额" }, { key:"before", label:"发放前余额" }, { key:"after", label:"发放后余额" }, { key:"applyTime", label:"申请时间" }, { key:"auditTime", label:"审核时间" }, { key:"applicant", label:"申请人" }],
    rowActions:[{ act:"approve", label:"通过" }, { act:"rejectReward", label:"驳回" }]
  };
  if (page === "teamReward") return {
    desc:"人工发放团队奖励并跟踪审核状态。", dataKey:"teamRewards", form:"teamReward",
    filters:[
      { key:"user", label:"用户编号" }, { key:"type", label:"类型", type:"select", options:["选择","推广费用","补偿","激励奖励","其他"] },
      { key:"status", label:"状态", type:"select", options:["选择","待审核","已完成","拒绝"] }, { key:"amount", label:"奖励金额" }, { key:"applyTime", label:"申请时间" }, { key:"auditTime", label:"审核时间" }
    ],
    columns:[{ key:"user", label:"用户编号" }, { key:"type", label:"类型" }, { key:"status", label:"状态" }, { key:"amount", label:"奖励金额" }, { key:"before", label:"发放前余额" }, { key:"after", label:"发放后余额" }, { key:"applyTime", label:"申请时间" }, { key:"auditTime", label:"审核时间" }, { key:"applicant", label:"申请人" }],
    toolbar:[{ act:"add", label:"奖励发放" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "contentOps" && tab === "popup") return {
    desc:"配置活动弹窗频次和时间。", dataKey:"popups", form:"popup",
    filters:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"title", label:"标题" }, { key:"link", label:"跳转链接" }, { key:"daily", label:"每日次数" }, { key:"interval", label:"间隔(分钟)" }, { key:"start", label:"开始时间" }, { key:"end", label:"结束时间" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"title", label:"标题" }, { key:"link", label:"跳转链接" }, { key:"daily", label:"每日次数" }, { key:"interval", label:"间隔(分钟)" }, { key:"start", label:"开始时间" }, { key:"end", label:"结束时间" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "contentOps" && tab === "message") return {
    desc:"管理系统/福利/签到消息。", dataKey:"messages", form:"message",
    filters:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"type", label:"类型", type:"select", options:["选择","系统消息","福利消息","签到活动"] }, { key:"title", label:"标题" }, { key:"link", label:"跳转链接" }, { key:"time", label:"发布时间" }, { key:"weight", label:"权重" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"type", label:"类型" }, { key:"title", label:"标题" }, { key:"link", label:"跳转链接" }, { key:"time", label:"发布时间" }, { key:"weight", label:"权重" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "contentOps") return {
    desc:"配置首页活动轮播。", dataKey:"banners", form:"banner",
    filters:[{ key:"title", label:"标题" }, { key:"operator", label:"所属运营商", type:"select", options:["选择","全局默认"].concat(DEMO.operatorOnly) }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"id", label:"ID" }, { key:"operator", label:"所属运营商" }, { key:"title", label:"标题" }, { key:"pos", label:"位置" }, { key:"link", label:"跳转链接" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "eventTypes") return {
    desc:"管理第三方上报类型。", dataKey:"eventTypes", form:"eventType",
    filters:[{ key:"name", label:"名称" }, { key:"partner", label:"合作方" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"id", label:"ID" }, { key:"name", label:"名称" }, { key:"partner", label:"合作方" }, { key:"code", label:"事件编码" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "eventDetails") return {
    desc:"查看上报事件明细，可模拟上报。", dataKey:"eventDetails",
    filters:[{ key:"type", label:"类型" }, { key:"user", label:"用户编号" }, { key:"product", label:"产品" }, { key:"channel", label:"渠道" }, { key:"status", label:"状态", type:"select", options:["选择","成功","失败"] }],
    columns:[{ key:"id", label:"ID" }, { key:"type", label:"类型" }, { key:"user", label:"用户" }, { key:"product", label:"产品" }, { key:"channel", label:"渠道" }, { key:"time", label:"时间" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"simulateReport", label:"模拟上报" }]
  };
  if (page === "attachments") return {
    desc:"管理上传到服务器或第三方存储的数据。", dataKey:"attachments", form:"attachment", formTitle:"附件",
    filters:[{ key:"cat", label:"分类", type:"select", options:["全部","分类一","分类二","自定义","未归类"] }, { key:"type", label:"类型筛选", type:"select", options:["全部","图片","音频","视频","文档","应用","压缩包"] }, { key:"name", label:"文件名" }],
    columns:[{ key:"name", label:"文件名" }, { key:"cat", label:"分类" }, { key:"type", label:"类型" }, { key:"size", label:"大小" }, { key:"time", label:"时间" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"classify", label:"归类" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "feedback") return {
    desc:"查看和处理产品建议。", dataKey:"feedback", form:"feedback",
    filters:[{ key:"user", label:"用户" }, { key:"status", label:"状态", type:"select", options:["选择","待处理","已回复"] }],
    columns:[{ key:"user", label:"用户" }, { key:"content", label:"内容" }, { key:"time", label:"时间" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"edit", label:"编辑" }],
    rowActions:[{ act:"edit", label:"处理" }]
  };
  if (page === "admins") return {
    desc:"一个管理员可以有多个角色组，左侧菜单按权限生成。", dataKey:"admins", form:"admin",
    filters:[{ key:"name", label:"用户名" }, { key:"groups", label:"角色组" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"name", label:"用户名" }, { key:"nickname", label:"昵称" }, { key:"groups", label:"角色组" }, { key:"status", label:"状态" }, { key:"last", label:"最后登录" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "roles") return {
    desc:"角色组可有上下级。子角色若有权限，可派生下级角色组或管理员。", dataKey:"roles", form:"role",
    filters:[{ key:"name", label:"角色组" }],
    columns:[{ key:"name", label:"角色组" }, { key:"parent", label:"上级" }, { key:"users", label:"人数" }, { key:"menus", label:"菜单范围" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"delete", label:"删除" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "menus") return {
    desc:"菜单规则通常对应一个控制器方法，同时菜单栏数据也从规则中获取。", dataKey:"menus", form:"menu",
    filters:[{ key:"name", label:"名称" }, { key:"status", label:"状态", type:"select", options:["选择","正常","隐藏"] }],
    columns:[{ key:"name", label:"名称" }, { key:"path", label:"路径" }, { key:"parent", label:"父级" }, { key:"status", label:"状态" }],
    toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"setNormal", label:"设为正常" }, { act:"setHidden", label:"设为隐藏" }, { act:"showAll", label:"显示全部" }],
    rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
  };
  if (page === "logs") return {
    desc:"管理员可以查看自己所拥有权限的操作日志。", dataKey:"logs",
    filters:[{ key:"admin", label:"管理员" }, { key:"action", label:"动作" }, { key:"target", label:"对象" }],
    columns:[{ key:"admin", label:"管理员" }, { key:"action", label:"动作" }, { key:"target", label:"对象" }, { key:"ip", label:"IP" }, { key:"time", label:"时间" }],
    toolbar:[{ act:"delete", label:"删除" }]
  };
  return null;
}
function getListConfig() { return currentListConfig() || extraListConfig() || moreListConfig(); }

function renderDashboard() {
  const kpis = DEMO.dashboard.kpis.map(k => '<button class="card kpi" data-page="' + k.page + '" data-rule-id="R-003"><div class="label">' + k.label + '</div><div class="value">' + k.value + '</div><div class="sub">' + k.sub + "</div></button>").join("");
  return '<p class="page-desc">用于展示当前系统中的统计数据、统计报表及重要实时数据。' + mark("R-004") + '</p><div class="kpi-grid">' + kpis + '</div><div class="chart-grid"><div class="card chart-card"><h3>最近 7 天注册趋势</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>奖励与提现对比</h3><canvas id="c2"></canvas></div></div>';
}
function afterDashboard() {
  drawLine($("c1"), DEMO.days, [[0,0,0,0,3,0,0]], ["#2f6bff"]);
  drawBars($("c2"), ["个人奖励","团队奖励","个人提现","团队提现"], [165,118,33,71], "#0f9f6e");
}
function renderOps() {
  const cfg = {
    desc:"按天查看新增用户、团队和广告费数据，默认展示最近 7 天。所有时间口径按中国时区自然日统计。",
    dataKey:"opsRows",
    filters:[{ key:"operator", label:"所属运营商", type:"select", options:OP_ALL }, { key:"date", label:"日期" }],
    columns:[
      { key:"date", label:"日期" }, { key:"newUsers", label:"新增用户" }, { key:"bind", label:"客服绑定人数" }, { key:"dau", label:"DAU日活" },
      { key:"pAll", label:"个人奖励(总)" }, { key:"pNew", label:"个人奖励(新)" }, { key:"pOld", label:"个人奖励(老)" },
      { key:"tAll", label:"团队总奖励" }, { key:"tReal", label:"团队真实" }, { key:"tManual", label:"团队人工" },
      { key:"pPeople", label:"个人提现人数(总/新/老)" }, { key:"pTimes", label:"个人提现次数(总/新/老)" },
      { key:"tPeople", label:"团队提现人数(总/新/老)" }, { key:"tTimes", label:"团队提现次数(总/新/老)" },
      { key:"adsAll", label:"总广告费/手续费/真实广告费" }, { key:"adsP", label:"个人广告费/手续费/真实广告费" }, { key:"adsT", label:"团队广告费/手续费/真实广告费" }
    ],
    beforeTable:'<div class="kpi-grid"><div class="card kpi"><div class="label">总用户数</div><div class="value">1,700</div></div><div class="card kpi"><div class="label">今日活跃用户</div><div class="value">1</div></div><div class="card kpi"><div class="label">已绑定客服用户</div><div class="value">22</div></div><div class="card kpi"><div class="label">真实广告费</div><div class="value">₹107,736.51</div></div></div><div class="chart-grid" data-rule-id="R-004"><div class="card chart-card"><h3>新增用户 / DAU</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>奖励趋势</h3><canvas id="c2"></canvas></div></div>'
  };
  return listPage(cfg);
}
function afterOps() {
  if (!$("c1")) return;
  drawLine($("c1"), DEMO.days, [DEMO.opsRows.map(r => r.newUsers).reverse(), DEMO.opsRows.map(r => r.dau).reverse()], ["#2f6bff","#0f9f6e"]);
  drawBars($("c2"), ["10-09","10-10","10-12","10-13"], [1000,5000,1800,200], "#d97706");
}
function renderRetention() {
  const cfg = {
    desc:"最多查询 7 天；D1 为注册次日，单元格展示活跃人数和占注册人数百分比。",
    dataKey:"retentionRows",
    filters:[{ key:"date", label:"用户注册日期" }, { key:"operator", label:"运营商", type:"select", options:["全部运营商","未设置运营商"].concat(DEMO.operatorOnly) }],
    columns:[{ key:"date", label:"注册日期" }, { key:"operator", label:"运营商" }, { key:"register", label:"当天注册人数" }, { key:"d1", label:"D1" }, { key:"d2", label:"D2" }, { key:"d3", label:"D3" }, { key:"d4", label:"D4" }, { key:"d5", label:"D5" }, { key:"d6", label:"D6" }, { key:"d7", label:"D7" }, { key:"d8", label:"D8" }, { key:"d9", label:"D9" }, { key:"d10", label:"D10" }, { key:"d11", label:"D11" }, { key:"d12", label:"D12" }, { key:"d13", label:"D13" }, { key:"d14", label:"D14" }, { key:"d15", label:"D15" }],
    beforeTable:'<div class="card chart-card" data-rule-id="R-004"><h3>D1-D7 留存率</h3><canvas id="c1"></canvas></div>'
  };
  return listPage(cfg);
}
function afterRetention() { if ($("c1")) drawLine($("c1"), ["D1","D2","D3","D4","D5","D6","D7"], [[33,25,17,15,12,10,8]], ["#7c3aed"]); }
function renderPartner() {
  const cfg = {
    desc:"基于第三方事件事实表实时计算；提现率采用人数口径，收益=充值金额-奖励金额-提现金额。",
    dataKey:"partnerRows",
    filters:[
      { key:"date", label:"统计日期" }, { key:"operator", label:"所属运营商", type:"select", options:OP }, { key:"product", label:"产品名称" },
      { key:"channel", label:"渠道ID" }, { key:"campaign", label:"活动ID" }, { key:"promoUser", label:"推广用户ID" }, { key:"userCode", label:"用户编号" }
    ],
    columns:[{ key:"date", label:"统计日期" }, { key:"register", label:"注册数" }, { key:"dau", label:"DAU" }, { key:"payUsers", label:"充值人数" }, { key:"payOrders", label:"充值单数" }, { key:"payAmt", label:"充值金额" }, { key:"reward", label:"奖励金额" }, { key:"wdUsers", label:"提现人数" }, { key:"wdAmt", label:"提现金额" }, { key:"arpu", label:"ARPU" }, { key:"arppu", label:"ARPPU" }, { key:"wdRate", label:"提现率(%)" }, { key:"profit", label:"收益" }],
    beforeTable:'<div class="chart-grid"><div class="card chart-card"><h3>注册 / 充值趋势</h3><canvas id="c1"></canvas></div><div class="card chart-card"><h3>收益对比</h3><canvas id="c2"></canvas></div></div>'
  };
  return listPage(cfg);
}
function afterPartner() {
  if (!$("c1")) return;
  drawLine($("c1"), ["10-10","10-11","10-12"], [[9,11,18],[2,4,6]], ["#2f6bff","#0f9f6e"]);
  drawBars($("c2"), ["UMoney","BC567","AF.GAME"], [4200,1500,700], "#0f9f6e");
}
function renderIncentiveReport() {
  const cfg = {
    desc:"用于运营查看跨活动、跨周期的达标表现与已发奖励分布。",
    dataKey:"incentiveRows",
    filters:[
      { key:"operator", label:"所属运营商", type:"select", options:OP_ALL },
      { key:"cycle", label:"刷新周期", type:"select", options:["全部周期","每日","每周","每月"] },
      { key:"type", label:"达标类型", type:"select", options:["全部类型","一级用户个人提现","团队收益"] }
    ],
    columns:[{ key:"operator", label:"所属运营商" }, { key:"title", label:"活动标题" }, { key:"cycle", label:"刷新周期" }, { key:"window", label:"统计窗口" }, { key:"type", label:"达标类型" }, { key:"wallet", label:"奖励去向" }, { key:"join", label:"参与人数" }, { key:"reach", label:"达标人数" }, { key:"invite", label:"总邀请人数" }, { key:"amount", label:"累计达标金额" }, { key:"reward", label:"已发奖励总额" }],
    rowActions:[{ act:"incentiveDetail", label:"查看明细" }],
    beforeTable:'<div class="kpi-grid"><div class="card kpi"><div class="label">已发奖励总额</div><div class="value">₹22,320.00</div></div><div class="card kpi"><div class="label">总邀请人数</div><div class="value">324</div></div><div class="card kpi"><div class="label">总一级用户提现</div><div class="value">₹79,170.00</div></div><div class="card kpi"><div class="label">总团队收益</div><div class="value">₹294,643.50</div></div></div><div class="card chart-card"><h3>参与 / 达标 / 已发奖励</h3><canvas id="c1"></canvas></div>'
  };
  return listPage(cfg);
}
function afterIncentive() { if ($("c1")) drawBars($("c1"), ["参与","达标","奖励(百)"], [6,1,21], "#2f6bff"); }
function renderRankReward() {
  const tab = state.tab.rankReward || "personal";
  const map = {
    personal: { data:"rankPersonal", label:"个人收益", hint:"上榜门槛：个人收益 ≥ 300" },
    team: { data:"rankTeam", label:"团队收益", hint:"上榜门槛：团队收益 ≥ 300" },
    invite: { data:"rankInvite", label:"邀请人数", hint:"上榜门槛：邀请人数 ≥ 1" }
  }[tab];
  const cfg = {
    desc: map.hint,
    dataKey: map.data,
    filters:[{ key:"code", label:"会员编号" }, { key:"name", label:"昵称" }, { key:"value", label: map.label }, { key:"time", label:"时间筛选" }],
    columns:[{ key:"rank", label:"排名" }, { key:"code", label:"会员编号" }, { key:"name", label:"昵称" }, { key:"username", label:"用户名" }, { key:"value", label: map.label }]
  };
  return subtabs("rankReward", [{ id:"personal", name:"个人榜" }, { id:"team", name:"团队榜" }, { id:"invite", name:"邀请人数榜" }]) + listPage(cfg);
}

function renderSettings() {
  const tab = state.tab.settings || "system";
  const head = tabs("settings", [{ id:"system", name:"系统配置" }, { id:"app", name:"应用配置" }, { id:"site", name:"站点配置" }]);
  if (tab === "app") {
    const cfg = {
      desc:"应用版本配置，支持新版本推送。", dataKey:"appConfigs", form:"app",
      filters:[{ key:"platform", label:"平台", type:"select", options:["选择","Android","iOS"] }, { key:"version", label:"版本" }],
      columns:[{ key:"platform", label:"平台" }, { key:"version", label:"版本" }, { key:"force", label:"强制更新" }, { key:"note", label:"说明" }, { key:"status", label:"状态" }],
      toolbar:[{ act:"add", label:"添加" }, { act:"edit", label:"编辑" }, { act:"delete", label:"删除" }, { act:"pushVersion", label:"新版本推送" }],
      rowActions:[{ act:"edit", label:"编辑" }, { act:"delete", label:"删除" }]
    };
    return head + listPage(cfg);
  }
  if (tab === "site") {
    const g = state.tab.siteGroup || "withdraw";
    const groups = subtabs("siteGroup", [{ id:"withdraw", name:"提现配置" }, { id:"system", name:"系统配置" }, { id:"content", name:"内容配置" }, { id:"invite", name:"邀请配置" }, { id:"rank", name:"排行配置" }]);
    const s = DEMO.siteConfig;
    let body = "";
    if (g === "withdraw") body = settingRows([["个人提现档位", s.personalTiers.join(" / ")],["团队提现档位", s.teamTiers.join(" / ")],["提现百分比", s.withdrawPct + "%"],["提现固定手续费", "₹" + s.withdrawFee],["个人钱包首次免手续费", s.firstFree],["团队累计提现审核比例", s.auditRatio + "%"],["团队有效用户审核门槛", s.validUser]]) + '<div style="margin-top:10px"><button class="btn secondary" id="btn-add-site-tier">追加档位</button></div>';
    if (g === "system") body = settingRows([["站点名称","Kamaai Center"],["时区","Asia/Shanghai"],["币种","INR"],["维护模式","关闭"]]);
    if (g === "content") body = settingRows([["提现教程视频","withdraw-guide.mp4"],["客服入口","启用"],["首页默认语言","English"]]) + '<div style="margin-top:10px"><button class="btn secondary" id="btn-upload-video">上传视频</button></div>';
    if (g === "invite") body = settingRows([["邀请码长度","8"],["邀请关系激活","完成新手任务后"],["裂变奖励","₹10"]]);
    if (g === "rank") body = settingRows([["个人榜门槛","₹300"],["团队榜门槛","₹300"],["邀请榜门槛","1人"]]);
    return head + operatorChips(state.operatorChip) + groups + '<div class="card"><div class="filters"><button class="btn" id="btn-add-config">新增配置</button></div>' + body + '<div style="margin-top:12px"><button class="btn" id="btn-save-setting">确定</button><button class="btn secondary" id="btn-reset-setting">重置</button></div></div>';
  }
  const g = state.tab.sysGroup || "base";
  const groups = subtabs("sysGroup", [{ id:"base", name:"基础配置" }, { id:"mail", name:"邮件配置" }, { id:"dict", name:"字典配置" }, { id:"member", name:"会员配置" }]);
  let body = "";
  if (g === "base") body = settingRows([["站点名称", DEMO.settings.siteName],["备案号", DEMO.settings.beian],["版本号", DEMO.settings.version],["时区", DEMO.settings.timezone],["语言", DEMO.settings.lang]]);
  if (g === "mail") body = settingRows([["SMTP", DEMO.settings.smtp],["发件人", DEMO.settings.mailFrom],["测试邮箱","admin@kamaai.test"]]);
  if (g === "dict") body = settingRows([["用户来源","买量 / 裂变 / 自然 / OAuth"],["钱包类型","个人 / 团队"]]);
  if (g === "member") body = settingRows([["默认状态","正常"],["注册奖励","₹10"]]);
  return head + '<p class="page-desc">可以在此增改系统的变量和分组，也可以自定义分组和变量。</p>' + groups + '<div class="card">' + body + '<div style="margin-top:12px"><button class="btn" id="btn-save-setting">确定</button><button class="btn secondary" id="btn-reset-setting">重置</button>' + (g === "mail" ? '<button class="btn secondary" id="btn-test-mail">发送测试邮件</button>' : "") + "</div></div>";
}
function settingRows(items) {
  return items.map(it => '<div class="setting-row"><span>' + it[0] + '</span><input value="' + it[1] + '"></div>').join("");
}
function renderProfile() {
  const p = DEMO.profile;
  return '<p class="page-desc">修改当前管理员资料。密码留空表示不修改。</p><div class="split-grid"><div class="card form-card"><h3>个人资料</h3><form id="profile-form" class="form-grid"><label class="field"><span>用户名</span><input name="name" value="' + p.name + '"></label><label class="field"><span>手机号</span><input name="mobile" value="' + p.mobile + '"></label><label class="field"><span>邮箱</span><input name="email" value="' + p.email + '"></label><label class="field"><span>昵称</span><input name="nickname" value="' + p.nickname + '"></label><label class="field full"><span>密码</span><input name="password" placeholder="留空则不修改"></label></form><div style="margin-top:12px"><button class="btn" id="btn-save-profile">提交</button><button class="btn secondary" id="btn-reset-profile">重置</button></div></div><div class="card"><h3>操作日志</h3>' + table(["时间","动作","对象"], DEMO.logs.map(l => [l.time,l.action,l.target])) + "</div></div>";
}
function renderRules() {
  $("rules-list").innerHTML = RULES.map(r => '<article class="rule-card" id="rule-' + r.id + '" data-rule-target="' + r.id + '"><div class="rule-id">' + r.id + "</div><h3>" + r.name + "</h3><p><b>适用：</b>" + r.when + "</p><p>" + r.text + "</p></article>").join("");
}
function wrapWithTabs(html) {
  if (state.page === "teams") return tabs("teams", [{ id:"team", name:"团队列表" }, { id:"level", name:"团队等级" }]) + html;
  if (state.page === "staff") return tabs("staff", [{ id:"staff", name:"员工" }, { id:"salary", name:"工资" }, { id:"kpi", name:"KPI" }]) + html;
  if (state.page === "payout") return tabs("payout", [{ id:"method", name:"提现方式" }, { id:"account", name:"用户提现账户" }]) + html;
  if (state.page === "teamReward") return tabs("teamReward", [{ id:"grant", name:"发放记录" }, { id:"audit", name:"奖励审核" }]) + html;
  if (state.page === "contentOps") return tabs("contentOps", [{ id:"banner", name:"活动轮播" }, { id:"popup", name:"活动弹窗" }, { id:"message", name:"消息通知" }]) + html;
  return html;
}
function editorTitle(mode) {
  const cfg = getListConfig();
  if (cfg && cfg.formTitle) return mode + cfg.formTitle;
  return mode + findPageMeta().name.replace(/管理$/, "");
}
function renderPage() {
  const meta = findPageMeta();
  $("crumb").textContent = meta.group + " / " + meta.name;
  $("page-title").textContent = meta.name;
  renderNav();
  let html = "";
  if (state.view === "loading") html = '<div class="card"><div class="loading">正在查询演示数据...</div></div>';
  else if (state.view === "error") html = '<div class="card"><div class="error-box" data-rule-id="R-009">查询失败，请保留当前条件后重试。' + mark("R-009") + '<div style="margin-top:10px"><button class="btn" id="btn-search">重试</button></div></div></div>';
  else if (state.view === "empty" && ["dashboard","settings","profile","rankReward"].includes(state.page)) html = '<div class="card"><div class="empty">没有找到匹配的记录</div></div>';
  else if (state.page === "dashboard") html = renderDashboard();
  else if (state.page === "ops") html = renderOps();
  else if (state.page === "retention") html = renderRetention();
  else if (state.page === "partner") html = renderPartner();
  else if (state.page === "incentiveReport") html = renderIncentiveReport();
  else if (state.page === "rankReward") html = renderRankReward();
  else if (state.page === "settings") html = renderSettings();
  else if (state.page === "profile") html = renderProfile();
  else {
    const cfg = getListConfig();
    html = wrapWithTabs(cfg ? listPage(cfg) : "<p>页面不存在</p>");
  }
  $("content").innerHTML = html;
  const after = { dashboard: afterDashboard, ops: afterOps, retention: afterRetention, partner: afterPartner, incentiveReport: afterIncentive, withdraw: function(){ if ($("c1")) drawBars($("c1"), ["待审核","打款中","已驳回"], [1,1,1], "#d97706"); } };
  if (after[state.page]) requestAnimationFrame(after[state.page]);
  bindPageEvents();
  if (state.highlight) highlightRule(state.highlight, false);
}

function currentRows() {
  const cfg = getListConfig();
  if (!cfg) return [];
  return (DEMO[cfg.dataKey] || []).filter(r => matchRow(r, cfg.filters || []));
}
function openEdit(mode, idx) {
  const cfg = getListConfig();
  const fields = FORMS[cfg && cfg.form];
  if (!fields) { toast("当前页无可编辑表单"); return; }
  const row = mode === "编辑" ? currentRows()[idx] : null;
  openDrawer(editorTitle(mode), formFields(fields, row) + mark("R-006"), '<button class="btn secondary" id="drawer-cancel">取消</button><button class="btn" id="drawer-save" data-rule-id="R-008">保存 ' + mark("R-008") + "</button>");
  if ($("btn-add-tier-row")) $("btn-add-tier-row").onclick = function() {
    const list = $("tier-list");
    const rowEl = document.createElement("div");
    rowEl.className = "kv";
    rowEl.innerHTML = '<input name="tier_min" placeholder="达标金额"><input name="tier_reward" placeholder="奖励"><button type="button" class="ghost-btn" data-remove-tier>x</button>';
    list.appendChild(rowEl);
  };
  document.querySelectorAll("[data-remove-tier]").forEach(btn => {
    btn.onclick = function() { if (btn.parentNode && btn.parentNode.parentNode) btn.parentNode.parentNode.removeChild(btn.parentNode); };
  });
  $("drawer-save").onclick = function() {
    if (!validate(fields)) return;
    if (state.view === "error") { toast("提交失败，请重试"); return; }
    closeDrawer();
    toast(mode === "添加" || mode === "新增" || mode === "奖励发放" ? "已新增并刷新列表" : "已保存并刷新列表");
    renderPage();
  };
}
function openTableDrawer(title, headers, rows) {
  openDrawer(title, table(headers, rows), '<button class="btn" id="drawer-cancel">关闭</button>');
  $("drawer-cancel").onclick = closeDrawer;
}
function handleAct(act, idx) {
  const rows = currentRows();
  const row = rows[idx];
  if (act === "edit" || act === "add") return openEdit(act === "add" ? "添加" : "编辑", idx);
  if (act === "ledger") return openTableDrawer("流水记录 - " + (row ? row.code : ""), ["时间","类型","金额","钱包","余额"], (DEMO.ledgers[(row && row.code) || ""] || [{ time:"-", type:"暂无流水", amount:"₹0.00", wallet:"-", balance:"-" }]).map(x => [x.time,x.type,x.amount,x.wallet,x.balance]));
  if (act === "teamIncome") return openTableDrawer("团队收益明细 - " + row.id, ["时间","来源","金额","说明"], [["2026-10-12","活动发放","₹300.00","周激励"],["2026-09-20","拉新奖励","₹9,000.00","一级贡献"]]);
  if (act === "teamView") { openDrawer("团队详情 - " + row.id, '<div class="detail-block"><b>队长</b>' + row.leader + " / " + row.invite + '</div><div class="detail-block"><b>成员</b>' + row.members + "，活跃度 " + row.active + '</div><div class="detail-block"><b>收益</b>赚取 ' + row.earn + "，真实收益 " + row.real + "</div>", '<button class="btn" id="drawer-cancel">关闭</button>'); return; }
  if (act === "productDetail") return openTableDrawer("产品推广明细 - " + row.id, ["产品","邀请人数","奖励"], [["UMoney","2","₹20.00"],["BC567","1","₹70.00"]]);
  if (act === "incentiveDetail") return openTableDrawer("激励明细", ["用户","是否达标","邀请人数","已发奖励"], [["Pro67","是","13","₹2,100.00"],["Sam57","否","3","₹0.00"]]);
  if (act === "productEvent") return openTableDrawer("产品事件 - " + row.name, ["事件","编码","最近上报"], [["register","af_register","2026-10-12 12:36:01"],["purchase","af_purchase","2026-10-11 18:02:44"]]);
  if (act === "productPreview") { openDrawer("产品预览 - " + row.name, '<div class="detail-block"><b>' + row.name + "</b>类型 " + row.type + " / 接入 " + row.access + " / 可见 " + row.vis + "</div><p>演示预览：用户端将展示该产品入口和奖励说明。</p>", '<button class="btn" id="drawer-cancel">关闭</button>'); return; }
  if (act === "delete") return confirmDanger("确认删除", "删除后列表立即刷新，该操作为演示。", function(){ toast("已删除并刷新列表"); renderPage(); });
  if (act === "reject") return confirmDanger("确认驳回", "驳回后状态变为已驳回。", function(){ if (row) row.status = "已驳回"; toast("已驳回并刷新列表"); renderPage(); });
  if (act === "rejectReward") return confirmDanger("确认驳回", "驳回后状态变为拒绝。", function(){ if (row) row.status = "拒绝"; toast("已驳回并刷新列表"); renderPage(); });
  if (act === "pay") { if (row) row.status = "打款中"; toast("已发起代付"); renderPage(); }
  if (act === "sync") { toast("已同步代付状态"); renderPage(); }
  if (act === "approve") { if (row) { row.status = "已完成"; row.auditTime = "2026-10-14 20:40:00"; } toast("已通过并刷新列表"); renderPage(); }
  if (act === "resetWhitelist") return confirmDanger("重置白名单测试账号", "将重置演示白名单账号状态。", function(){ toast("已重置白名单测试账号"); });
  if (act === "setNormal") { if (row) row.status = "正常"; toast("已设为正常"); renderPage(); }
  if (act === "setHidden") { if (row) row.status = "隐藏"; toast("已设为隐藏"); renderPage(); }
  if (act === "settleWeek" || act === "settleMonth") return confirmDanger(act === "settleWeek" ? "测试结算当前周" : "测试结算当前月", "该操作为演示结算，不会写真实账。", function(){ toast("已完成测试结算"); });
  if (act === "simulateGrant") return confirmDanger("模拟发放", "将按当前档位模拟发放奖励。", function(){ toast("已模拟发放"); });
  if (act === "simulateReport") { toast("已模拟上报一条事件"); DEMO.eventDetails.unshift({ id:"ED-NEW", type:"register", user:"58807234", product:"UMoney", channel:"demo", time:"2026-10-14 20:41:00", status:"成功" }); renderPage(); }
  if (act === "refreshProgress") { toast("已刷新工资进度"); renderPage(); }
  if (act === "auditPay") return confirmDanger("审核发放", "确认发放当前工资单？", function(){ DEMO.salary.forEach(s => s.status = "已发放"); toast("已审核发放"); renderPage(); });
  if (act === "import") { toast("已导入演示工资表"); }
  if (act === "downloadTemplate") { toast("已下载模板（演示）"); }
  if (act === "pushVersion") return confirmDanger("新版本推送", "将向客户端推送当前版本。", function(){ toast("已推送新版本"); });
  if (act === "classify") { toast("已归类选中附件"); }
  if (act === "showAll") { state.view = "default"; toast("已显示全部菜单"); renderPage(); }
}
function handleTool(act) {
  if (["add","edit","delete","pay","reject","sync"].includes(act)) return handleAct(act, 0);
  return handleAct(act, 0);
}
function bindPageEvents() {
  document.querySelectorAll("[data-page]").forEach(el => {
    el.onclick = function() {
      state.page = el.getAttribute("data-page");
      state.view = "default";
      renderPage();
    };
  });
  document.querySelectorAll("[data-tab]").forEach(el => {
    el.onclick = function() { state.tab[el.dataset.tabGroup] = el.dataset.tab; renderPage(); };
  });
  document.querySelectorAll("[data-chip]").forEach(el => {
    el.onclick = function() { state.operatorChip = el.dataset.chip; renderPage(); };
  });
  document.querySelectorAll("[data-filter]").forEach(el => {
    el.onchange = el.oninput = function() { setFilterValue(el.dataset.filter, el.value); };
  });
  if ($("btn-search")) $("btn-search").onclick = function() {
    state.view = state.view === "error" ? "error" : "loading";
    renderPage();
    setTimeout(function(){ if (state.view === "loading") { state.view = "default"; renderPage(); } }, 400);
  };
  if ($("btn-reset-filter")) $("btn-reset-filter").onclick = function() {
    Object.keys(state.filters).forEach(k => { if (k.indexOf(state.page + ":") === 0) delete state.filters[k]; });
    state.view = "default";
    renderPage();
  };
  if ($("btn-export")) $("btn-export").onclick = function() { $("export-menu").classList.toggle("show"); };
  document.querySelectorAll("[data-export]").forEach(btn => btn.onclick = function(){ toast("已导出 " + btn.dataset.export + "（演示）"); });
  document.querySelectorAll("[data-tool]").forEach(btn => btn.onclick = function(){ handleTool(btn.dataset.tool); });
  document.querySelectorAll("[data-act]").forEach(btn => btn.onclick = function(){ handleAct(btn.dataset.act, Number(btn.dataset.idx || 0)); });
  if ($("btn-save-setting")) $("btn-save-setting").onclick = function(){ if (state.view === "error") return toast("保存失败，请重试"); toast("配置已保存"); };
  if ($("btn-reset-setting")) $("btn-reset-setting").onclick = function(){ toast("已重置为演示配置"); renderPage(); };
  if ($("btn-test-mail")) $("btn-test-mail").onclick = function(){ toast("已发送测试邮件（演示）"); };
  if ($("btn-add-site-tier")) $("btn-add-site-tier").onclick = function(){ DEMO.siteConfig.personalTiers.push("2000"); toast("已追加个人提现档位"); renderPage(); };
  if ($("btn-upload-video")) $("btn-upload-video").onclick = function(){ toast("已上传提现教程视频（演示）"); };
  if ($("btn-add-config")) $("btn-add-config").onclick = function(){
    openDrawer("新增配置", formFields([{ key:"name", label:"配置名", required:true }, { key:"title", label:"标题", required:true }, { key:"group", label:"分组", type:"select", options:["提现配置","系统配置","内容配置","邀请配置","排行配置"] }, { key:"type", label:"类型", type:"select", options:["字符","数字","数组"] }], null), '<button class="btn secondary" id="drawer-cancel">取消</button><button class="btn" id="drawer-save">确定新增</button>');
    $("drawer-cancel").onclick = closeDrawer;
    $("drawer-save").onclick = function(){ if (!validate([{ key:"name", label:"配置名", required:true }, { key:"title", label:"标题", required:true }])) return; closeDrawer(); toast("已新增配置"); };
  };
  if ($("btn-save-profile")) $("btn-save-profile").onclick = function(){ if (state.view === "error") return toast("保存失败，请重试"); toast("个人资料已保存"); };
  if ($("btn-reset-profile")) $("btn-reset-profile").onclick = function(){ renderPage(); };
}
function highlightRule(id, scrollRule) {
  state.highlight = id;
  document.querySelectorAll(".rule-card").forEach(c => c.classList.toggle("active", c.dataset.ruleTarget === id));
  document.querySelectorAll("[data-rule-id]").forEach(el => el.classList.toggle("highlight", el.getAttribute("data-rule-id") === id));
  const rule = $("rule-" + id);
  const target = document.querySelector('[data-rule-id="' + id + '"]');
  if (scrollRule && rule) rule.scrollIntoView({ behavior:"smooth", block:"center" });
  if (!scrollRule && target) target.scrollIntoView({ behavior:"smooth", block:"center" });
}
function bindGlobal() {
  document.body.addEventListener("click", function(e) {
    const markBtn = e.target.closest("[data-rule-id]");
    if (markBtn) highlightRule(markBtn.getAttribute("data-rule-id"), true);
    const card = e.target.closest("[data-rule-target]");
    if (card) highlightRule(card.getAttribute("data-rule-target"), false);
  });
  $("drawer-mask").addEventListener("click", function(e){ if (e.target.id === "drawer-mask") closeDrawer(); });
  $("modal-mask").addEventListener("click", function(e){ if (e.target.id === "modal-mask") closeModal(); });
  $("btn-loading").onclick = function(){ state.view = "loading"; renderPage(); };
  $("btn-empty").onclick = function(){ state.view = "empty"; renderPage(); };
  $("btn-error").onclick = function(){ state.view = "error"; renderPage(); };
  $("btn-reset").onclick = function(){ state.view = "default"; renderPage(); };
}
renderRules();
bindGlobal();
renderPage();

