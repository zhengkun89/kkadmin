window.DEMO = {
  operators: ["全部运营商", "YLan", "黄山团队", "杭州团队", "老板团队", "香港运营商", "测试"],
  nav: [
    { group: "总览", items: [{ id: "dashboard", name: "控制台" }] },
    { group: "数据", items: [
      { id: "ops", name: "经营数据" },
      { id: "retention", name: "留存分析" },
      { id: "partner", name: "第三方事件" },
      { id: "incentiveReport", name: "激励报表" }
    ]},
    { group: "用户", items: [
      { id: "users", name: "用户管理" },
      { id: "teams", name: "团队管理" }
    ]},
    { group: "员工", items: [{ id: "staff", name: "员工与薪酬" }] },
    { group: "活动", items: [
      { id: "novice", name: "新手任务" },
      { id: "rankActivity", name: "排行活动" },
      { id: "rankReward", name: "榜单奖励" },
      { id: "incentiveConfig", name: "激励配置" }
    ]},
    { group: "产品", items: [{ id: "products", name: "推广产品" }] },
    { group: "资金", items: [
      { id: "withdraw", name: "提现审核" },
      { id: "payout", name: "提现配置" },
      { id: "teamReward", name: "团队奖励" }
    ]},
    { group: "内容", items: [{ id: "contentOps", name: "首页运营" }] },
    { group: "回传", items: [
      { id: "eventTypes", name: "上报类型" },
      { id: "eventDetails", name: "事件明细" }
    ]},
    { group: "系统", items: [
      { id: "settings", name: "平台配置" },
      { id: "attachments", name: "附件" },
      { id: "profile", name: "个人资料" },
      { id: "feedback", name: "产品建议" }
    ]},
    { group: "权限", items: [
      { id: "admins", name: "管理员" },
      { id: "roles", name: "角色组" },
      { id: "menus", name: "菜单规则" },
      { id: "logs", name: "操作日志" }
    ]}
  ],
  days: ["10-08", "10-09", "10-10", "10-11", "10-12", "10-13", "10-14"],
  dashboard: {
    kpis: [
      { label: "总会员数", value: "1,700", sub: "近7日 +3", page: "users" },
      { label: "今日注册", value: "0", sub: "三日新增 3", page: "ops" },
      { label: "个人总奖励", value: "₹165,671", sub: "团队奖励 ₹118,902", page: "ops" },
      { label: "个人总提现", value: "₹33,300", sub: "团队提现 ₹71,230", page: "withdraw" }
    ]
  },
  opsRows: [
    { date: "2026-10-14", newUsers: 0, bind: 0, dau: 1, personal: "₹0.00", team: "₹0.00", ads: "₹0.00" },
    { date: "2026-10-13", newUsers: 0, bind: 0, dau: 0, personal: "₹0.00", team: "₹200.00", ads: "₹0.00" },
    { date: "2026-10-12", newUsers: 3, bind: 0, dau: 1, personal: "₹1,800.00", team: "₹0.00", ads: "₹0.00" },
    { date: "2026-10-11", newUsers: 0, bind: 0, dau: 3, personal: "₹0.00", team: "₹0.00", ads: "₹0.00" },
    { date: "2026-10-10", newUsers: 0, bind: 0, dau: 1, personal: "₹5,000.00", team: "₹0.00", ads: "₹0.00" },
    { date: "2026-10-09", newUsers: 0, bind: 0, dau: 2, personal: "₹1,000.00", team: "₹0.00", ads: "₹0.00" },
    { date: "2026-10-08", newUsers: 0, bind: 0, dau: 12, personal: "₹0.00", team: "₹0.00", ads: "₹0.00" }
  ],
  retentionRows: [
    { date: "2026-10-12", operator: "YLan", register: 3, d1: "0 / 0%", d2: "0 / 0%", d3: "0 / 0%", d7: "0 / 0%" },
    { date: "2026-10-08", operator: "YLan", register: 12, d1: "4 / 33%", d2: "3 / 25%", d3: "2 / 17%", d7: "1 / 8%" },
    { date: "2026-10-01", operator: "黄山团队", register: 8, d1: "3 / 38%", d2: "2 / 25%", d3: "2 / 25%", d7: "1 / 13%" }
  ],
  partnerRows: [
    { date: "2026-10-12", product: "UMoney", register: 18, recharge: 6, amount: "₹8,400", withdraw: "₹2,100", profit: "₹4,200" },
    { date: "2026-10-11", product: "BC567", register: 11, recharge: 4, amount: "₹3,200", withdraw: "₹800", profit: "₹1,500" },
    { date: "2026-10-10", product: "AF.GAME", register: 9, recharge: 2, amount: "₹1,600", withdraw: "₹400", profit: "₹700" }
  ],
  incentiveRows: [
    { operator: "YLan", title: "Withdrawal Amount111", cycle: "每周刷新", window: "10-12 ~ 10-18", type: "团队收益", join: 2, reach: 0, reward: "₹0.00" },
    { operator: "YLan", title: "Withdrawal Amount111", cycle: "每周刷新", window: "09-14 ~ 09-20", type: "团队收益", join: 6, reach: 1, reward: "₹2,100.00" },
    { operator: "黄山团队", title: "Withdrawal Amount111", cycle: "每周刷新", window: "08-24 ~ 08-30", type: "团队收益", join: 1, reach: 0, reward: "₹0.00" }
  ]
};

DEMO.users = [
  { id: "U-1700", name: "Kiran87", parent: "Sunny54", code: "58807234", mobile: "98111****15", source: "Test", channel: "growth_reward_test", personal: "₹0.00", team: "₹0.00", status: "正常", operator: "YLan" },
  { id: "U-1699", name: "Win42", parent: "Sunny54", code: "49069325", mobile: "98111****14", source: "Test", channel: "growth_reward_test", personal: "₹20.00", team: "₹0.00", status: "正常", operator: "YLan" },
  { id: "U-1698", name: "Top61", parent: "Sunny54", code: "20686104", mobile: "98111****13", source: "Test", channel: "growth_reward_test", personal: "₹2,200.00", team: "₹200.00", status: "限制提现", operator: "YLan" },
  { id: "U-1680", name: "Joy12", parent: "-", code: "32182945", mobile: "62232****24", source: "买量", channel: "facebook", personal: "₹5,800.00", team: "₹0.00", status: "正常", operator: "YLan" }
];
DEMO.teams = [
  { id: "T-01", name: "YLan核心团", leader: "Sunny54", members: 128, level: "LV3", status: "正常" },
  { id: "T-02", name: "黄山先锋", leader: "Hari16", members: 86, level: "LV2", status: "正常" },
  { id: "T-03", name: "测试团", leader: "Sam57", members: 12, level: "LV1", status: "隐藏" }
];
DEMO.teamLevels = [
  { id: "L-1", name: "LV1", minMembers: 0, bonus: "1%", status: "启用" },
  { id: "L-2", name: "LV2", minMembers: 50, bonus: "3%", status: "启用" },
  { id: "L-3", name: "LV3", minMembers: 100, bonus: "5%", status: "启用" }
];
DEMO.staff = [
  { id: "E-01", name: "pang", role: "运营主管", operator: "YLan", status: "在职" },
  { id: "E-02", name: "Mina", role: "客服", operator: "黄山团队", status: "在职" },
  { id: "E-03", name: "Leo", role: "审核员", operator: "杭州团队", status: "停用" }
];
DEMO.salary = [
  { id: "S-01", staff: "pang", month: "2026-09", base: "₹8,000", kpi: "₹2,000", total: "₹10,000", status: "已发放" },
  { id: "S-02", staff: "Mina", month: "2026-09", base: "₹5,000", kpi: "₹800", total: "₹5,800", status: "待发放" }
];
DEMO.kpi = [
  { id: "K-01", staff: "pang", target: "拉新 200", actual: "186", rate: "93%", month: "2026-09" },
  { id: "K-02", staff: "Mina", target: "绑定 80", actual: "72", rate: "90%", month: "2026-09" }
];
DEMO.novice = [
  { id: "N-01", operator: "全局默认", key: "bind_mobile_register", title: "Bind phone number", goal: "₹0", reward: "₹10", auto: "否", status: "正常" },
  { id: "N-02", operator: "全局默认", key: "join_tg_channel", title: "Join the Telegram channel", goal: "₹0", reward: "₹10", auto: "否", status: "正常" },
  { id: "N-03", operator: "YLan", key: "first_payment", title: "Complete first payment", goal: "₹0", reward: "₹70", auto: "否", status: "正常" }
];
DEMO.rankActivity = [
  { id: "A-01", title: "Weekly Invite Rank", cycle: "每周", operator: "YLan", status: "进行中" },
  { id: "A-02", title: "October Recharge Rank", cycle: "每月", operator: "全局默认", status: "未开始" }
];
DEMO.rankReward = [
  { id: "RWD-01", activity: "Weekly Invite Rank", rank: "Top 1", reward: "₹1,000", wallet: "个人钱包" },
  { id: "RWD-02", activity: "Weekly Invite Rank", rank: "Top 2-5", reward: "₹300", wallet: "个人钱包" }
];
DEMO.incentiveConfig = [
  { id: "IC-01", title: "Withdrawal Amount111", cycle: "每周", type: "团队收益", wallet: "团队钱包", status: "启用" },
  { id: "IC-02", title: "First Recharge Boost", cycle: "每日", type: "一级用户个人提现", wallet: "个人钱包", status: "停用" }
];
DEMO.products = [
  { id: "P-12", name: "UMoney", operator: "YLan", channel: "facebook", status: "上架" },
  { id: "P-08", name: "BC567", operator: "全局默认", channel: "organic", status: "上架" },
  { id: "P-13", name: "AF.GAME", operator: "黄山团队", channel: "telegram", status: "下架" }
];
DEMO.withdraw = [
  { id: "W-9001", request: "WD20261012001", user: "58807234", operator: "YLan", wallet: "个人", amount: "₹500.00", fee: "₹10.00", actual: "₹490.00", method: "UPI", account: "upi****15", status: "待审核" },
  { id: "W-9002", request: "WD20261011008", user: "49069325", operator: "YLan", wallet: "团队", amount: "₹1,200.00", fee: "₹20.00", actual: "₹1,180.00", method: "UPI", account: "upi****14", status: "打款中" },
  { id: "W-9003", request: "WD20261010003", user: "32182945", operator: "YLan", wallet: "个人", amount: "₹800.00", fee: "₹10.00", actual: "₹790.00", method: "Bank", account: "bank****24", status: "已驳回" }
];
DEMO.payoutMethods = [
  { id: "M-01", name: "UPI", code: "upi", min: "₹100", max: "₹50,000", status: "启用" },
  { id: "M-02", name: "Bank Transfer", code: "bank", min: "₹500", max: "₹100,000", status: "启用" }
];
DEMO.payoutAccounts = [
  { id: "PA-01", method: "UPI", account: "kamaai@upi", merchant: "PayChannel-A", status: "启用" },
  { id: "PA-02", method: "Bank", account: "****8821", merchant: "PayChannel-B", status: "停用" }
];
DEMO.teamRewards = [
  { id: "TR-01", team: "YLan核心团", amount: "₹2,100", reason: "周激励达标", status: "待审核" },
  { id: "TR-02", team: "黄山先锋", amount: "₹800", reason: "人工补发", status: "已发放" }
];
DEMO.banners = [
  { id: "B-01", title: "Diwali Bonus", pos: "首页顶部", status: "启用" },
  { id: "B-02", title: "New Game", pos: "活动位", status: "停用" }
];
DEMO.popups = [
  { id: "POP-01", title: "绑定手机奖励", trigger: "新用户首次进入", status: "启用" }
];
DEMO.messages = [
  { id: "MSG-01", title: "提现到账通知", audience: "全部用户", status: "已发送" },
  { id: "MSG-02", title: "活动开启", audience: "YLan", status: "草稿" }
];
DEMO.eventTypes = [
  { id: "ET-01", name: "register", partner: "Adjust", status: "启用" },
  { id: "ET-02", name: "purchase", partner: "AppsFlyer", status: "启用" }
];
DEMO.eventDetails = [
  { id: "ED-01", type: "register", user: "58807234", product: "UMoney", time: "2026-10-12 12:36:01", status: "成功" },
  { id: "ED-02", type: "purchase", user: "32182945", product: "BC567", time: "2026-10-11 18:02:44", status: "成功" }
];
DEMO.attachments = [
  { id: "F-01", name: "banner-diwali.png", size: "182 KB", time: "2026-10-10 09:12" },
  { id: "F-02", name: "task-icon.svg", size: "12 KB", time: "2026-10-08 16:40" }
];
DEMO.feedback = [
  { id: "FB-01", user: "Joy12", content: "提现到账较慢", status: "待处理" },
  { id: "FB-02", user: "Hari16", content: "希望增加更多任务", status: "已回复" }
];
DEMO.admins = [
  { id: "AD-01", name: "wuyanzu", role: "超级管理员", status: "正常" },
  { id: "AD-02", name: "pang", role: "运营", status: "正常" }
];
DEMO.roles = [
  { id: "RG-01", name: "超级管理员", users: 1, menus: "全部" },
  { id: "RG-02", name: "运营", users: 3, menus: "数据/用户/活动" }
];
DEMO.menus = [
  { id: "MN-01", name: "控制台", path: "/dashboard", status: "显示" },
  { id: "MN-02", name: "经营数据", path: "/ops", status: "显示" }
];
DEMO.logs = [
  { id: "LG-01", admin: "wuyanzu", action: "编辑用户", target: "Kiran87", time: "2026-10-14 10:21" },
  { id: "LG-02", admin: "pang", action: "驳回提现", target: "W-9003", time: "2026-10-12 19:08" }
];
DEMO.settings = {
  siteName: "Kamaai Center",
  timezone: "Asia/Shanghai",
  currency: "INR",
  appVersion: "2.4.1",
  h5Domain: "https://h5.kamaai.test"
};
DEMO.profile = { name: "wuyanzu", email: "admin@kamaai.test", nickname: "超管" };
