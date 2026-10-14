window.DEMO = {
  operators: ["全部运营商", "YLan", "黄山团队", "杭州团队", "老板团队", "香港运营商", "测试"],
  operatorOnly: ["YLan", "黄山团队", "杭州团队", "老板团队", "香港运营商", "测试"],
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
  days: ["10-08","10-09","10-10","10-11","10-12","10-13","10-14"],
  dashboard: {
    kpis: [
      { label: "总会员数", value: "1,700", sub: "近7日 +3", page: "users" },
      { label: "今日注册", value: "0", sub: "三日新增 3", page: "ops" },
      { label: "个人总奖励", value: "₹165,671.51", sub: "团队奖励 ₹118,902.00", page: "ops" },
      { label: "个人总提现", value: "₹33,300.11", sub: "团队提现 ₹71,230.00", page: "withdraw" }
    ]
  }
};

DEMO.opsRows = [
  { date:"2026-10-14", newUsers:0, bind:0, dau:1, pAll:"₹0.00", pNew:"₹0.00", pOld:"₹0.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-13", newUsers:0, bind:0, dau:0, pAll:"₹0.00", pNew:"₹0.00", pOld:"₹0.00", tAll:"₹200.00", tReal:"₹0.00", tManual:"₹200.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-12", newUsers:3, bind:0, dau:1, pAll:"₹1,800.00", pNew:"₹0.00", pOld:"₹1,800.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-11", newUsers:0, bind:0, dau:3, pAll:"₹0.00", pNew:"₹0.00", pOld:"₹0.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-10", newUsers:0, bind:0, dau:1, pAll:"₹5,000.00", pNew:"₹0.00", pOld:"₹5,000.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-09", newUsers:0, bind:0, dau:2, pAll:"₹1,000.00", pNew:"₹0.00", pOld:"₹1,000.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" },
  { date:"2026-10-08", newUsers:0, bind:0, dau:12, pAll:"₹0.00", pNew:"₹0.00", pOld:"₹0.00", tAll:"₹0.00", tReal:"₹0.00", tManual:"₹0.00", pPeople:"0/0/0", pTimes:"0/0/0", tPeople:"0/0/0", tTimes:"0/0/0", adsAll:"₹0.00/₹0.00/₹0.00", adsP:"₹0.00/₹0.00/₹0.00", adsT:"₹0.00/₹0.00/₹0.00" }
];
DEMO.retentionRows = [
  { date:"2026-10-12", operator:"YLan", register:3, d1:"0 / 0%", d2:"0 / 0%", d3:"0 / 0%", d4:"0 / 0%", d5:"0 / 0%", d6:"0 / 0%", d7:"0 / 0%", d8:"0 / 0%", d9:"0 / 0%", d10:"0 / 0%", d11:"0 / 0%", d12:"0 / 0%", d13:"0 / 0%", d14:"0 / 0%", d15:"0 / 0%" },
  { date:"2026-10-08", operator:"YLan", register:12, d1:"4 / 33%", d2:"3 / 25%", d3:"2 / 17%", d4:"2 / 17%", d5:"1 / 8%", d6:"1 / 8%", d7:"1 / 8%", d8:"1 / 8%", d9:"1 / 8%", d10:"0 / 0%", d11:"0 / 0%", d12:"0 / 0%", d13:"0 / 0%", d14:"0 / 0%", d15:"0 / 0%" },
  { date:"2026-10-01", operator:"黄山团队", register:8, d1:"3 / 38%", d2:"2 / 25%", d3:"2 / 25%", d4:"1 / 13%", d5:"1 / 13%", d6:"1 / 13%", d7:"1 / 13%", d8:"1 / 13%", d9:"0 / 0%", d10:"0 / 0%", d11:"0 / 0%", d12:"0 / 0%", d13:"0 / 0%", d14:"0 / 0%", d15:"0 / 0%" }
];
DEMO.partnerRows = [
  { date:"2026-10-12", operator:"YLan", product:"UMoney", channel:"facebook", campaign:"c_1001", promoUser:"U-1680", userCode:"32182945", register:18, dau:9, payUsers:6, payOrders:8, payAmt:"₹8,400", reward:"₹2,100", wdUsers:3, wdAmt:"₹2,100", arpu:"₹466.67", arppu:"₹1,400", wdRate:"16.67%", profit:"₹4,200" },
  { date:"2026-10-11", operator:"YLan", product:"BC567", channel:"organic", campaign:"c_0888", promoUser:"U-1698", userCode:"20686104", register:11, dau:5, payUsers:4, payOrders:4, payAmt:"₹3,200", reward:"₹900", wdUsers:1, wdAmt:"₹800", arpu:"₹290.91", arppu:"₹800", wdRate:"9.09%", profit:"₹1,500" },
  { date:"2026-10-10", operator:"黄山团队", product:"AF.GAME", channel:"telegram", campaign:"c_0777", promoUser:"-", userCode:"50144704", register:9, dau:4, payUsers:2, payOrders:2, payAmt:"₹1,600", reward:"₹500", wdUsers:1, wdAmt:"₹400", arpu:"₹177.78", arppu:"₹800", wdRate:"11.11%", profit:"₹700" }
];
DEMO.incentiveRows = [
  { operator:"YLan", title:"Withdrawal Amount111", cycle:"每周刷新", window:"2026-10-12 00:00:00 ~ 2026-10-18 23:59:59", type:"团队收益", wallet:"团队钱包", join:2, reach:0, invite:3, amount:"₹200.00", reward:"₹0.00" },
  { operator:"YLan", title:"Withdrawal Amount111", cycle:"每周刷新", window:"2026-09-14 00:00:00 ~ 2026-09-20 23:59:59", type:"团队收益", wallet:"团队钱包", join:6, reach:1, invite:13, amount:"₹4,000.00", reward:"₹2,100.00" },
  { operator:"黄山团队", title:"Withdrawal Amount111", cycle:"每周刷新", window:"2026-08-24 00:00:00 ~ 2026-08-30 23:59:59", type:"团队收益", wallet:"团队钱包", join:1, reach:0, invite:1, amount:"₹0.00", reward:"₹0.00" }
];
DEMO.users = [
  { id:"1700", name:"Kiran87", parent:"Sunny54（1648）", code:"58807234", mobile:"98111****15", android:"-", upi:"-", time:"2026-10-12 12:35:52", source:"Test", channel:"growth_reward_test", links:"0 个", pBal:"₹0.00", pWd:"₹0.00", promo:"0", eq:"0", pct:"0", tBal:"₹0.00", tWd:"₹0.00", totalWd:"₹0.00", status:"正常", operator:"YLan" },
  { id:"1699", name:"Win42", parent:"Sunny54（1648）", code:"49069325", mobile:"98111****14", android:"-", upi:"-", time:"2026-10-12 12:35:52", source:"Test", channel:"growth_reward_test", links:"0 个", pBal:"₹0.00", pWd:"₹20.00", promo:"0", eq:"0", pct:"0", tBal:"₹0.00", tWd:"₹0.00", totalWd:"₹20.00", status:"正常", operator:"YLan" },
  { id:"1698", name:"Top61", parent:"Sunny54（1648）", code:"20686104", mobile:"98111****13", android:"-", upi:"-", time:"2026-10-12 12:35:52", source:"Test", channel:"growth_reward_test", links:"0 个", pBal:"₹2,200.00", pWd:"₹2,200.00", promo:"0", eq:"0", pct:"0", tBal:"₹200.00", tWd:"₹0.00", totalWd:"₹2,200.00", status:"限制提现", operator:"YLan" },
  { id:"1680", name:"Joy12", parent:"-", code:"32182945", mobile:"62232****24", android:"f5ea72****", upi:"-", time:"2026-10-02 12:23:36", source:"买量", channel:"facebook", links:"2 个", pBal:"₹5,800.00", pWd:"₹0.00", promo:"0", eq:"0", pct:"0", tBal:"₹0.00", tWd:"₹0.00", totalWd:"₹0.00", status:"正常", operator:"YLan" }
];
DEMO.ledgers = {
  "58807234": [{ time:"2026-10-12 12:36:10", type:"注册奖励", amount:"+₹10.00", wallet:"个人", balance:"₹10.00" }],
  "32182945": [{ time:"2026-10-03 09:12:00", type:"推广奖励", amount:"+₹20.00", wallet:"个人", balance:"₹5,800.00" }, { time:"2026-10-04 18:01:22", type:"任务奖励", amount:"+₹70.00", wallet:"个人", balance:"₹5,870.00" }]
};

DEMO.teams = [
  { id:"T34434224", leaderId:"34434224", leader:"Sam57", invite:"ZHLHZPT3", mobile:"62232****80", operator:"YLan", level:"L0", members:"1/1/0", active:"100%", contrib:"9050/9050/0", memberWd:"500/500/0", earn:"9350", leaderWd:"0", real:"9050(9000/50)", grant:"300/0" },
  { id:"T50144704", leaderId:"50144704", leader:"Hari16", invite:"RDUE0PQ8", mobile:"62232****30", operator:"YLan", level:"L0", members:"1/1/0", active:"100%", contrib:"0/0/0", memberWd:"0/0/0", earn:"0", leaderWd:"0", real:"0(0/0)", grant:"0/0" },
  { id:"T44643055", leaderId:"44643055", leader:"Pro67", invite:"UKS6JS7A", mobile:"62232****44", operator:"YLan", level:"L1", members:"8/6/2", active:"12.5%", contrib:"3000/3000/0", memberWd:"0/0/0", earn:"5100", leaderWd:"2000", real:"3000(3000/0)", grant:"2100/0" }
];
DEMO.teamLevels = [
  { id:"L-1", operator:"YLan", name:"L1", value:"1", range:"₹0 - ₹9,999", p1:"3%", p2:"1%", status:"正常" },
  { id:"L-2", operator:"YLan", name:"L2", value:"2", range:"₹10,000 - ₹49,999", p1:"5%", p2:"2%", status:"正常" },
  { id:"L-3", operator:"全局默认", name:"L3", value:"3", range:"₹50,000+", p1:"8%", p2:"3%", status:"隐藏" }
];
DEMO.staff = [
  { id:"E-01", name:"pang", mobile:"138****1201", link:"https://h5.kamaai.test/i/pang", tg:"@pang_ops", operator:"YLan", bindUser:"Sunny54", selfInvite:36, partnerInvite:12, rebate:"₹2,800", kpi:"93%", pWd:"₹1,200", tWd:"₹800", time:"2026-08-01 10:00:00" },
  { id:"E-02", name:"Mina", mobile:"139****2202", link:"https://h5.kamaai.test/i/mina", tg:"@mina_cs", operator:"黄山团队", bindUser:"Hari16", selfInvite:18, partnerInvite:4, rebate:"₹960", kpi:"90%", pWd:"₹400", tWd:"₹0", time:"2026-09-12 14:20:00" }
];
DEMO.salary = [
  { id:"S-01", staff:"pang", month:"2026-09", cycle:"本月", base:"₹8,000", kpi:"₹2,000", total:"₹10,000", progress:"93%", status:"已发放" },
  { id:"S-02", staff:"Mina", month:"2026-09", cycle:"本月", base:"₹5,000", kpi:"₹800", total:"₹5,800", progress:"90%", status:"待审核" }
];
DEMO.kpi = [
  { id:"K-01", operator:"YLan", cycle:"本月", invite:200, rebate:"₹3,000", wdUsers:40, pUsers:25, tUsers:15, wdAmt:"₹20,000", pAmt:"₹12,000", tAmt:"₹8,000", firstTask:30, partnerWd:12 },
  { id:"K-02", operator:"黄山团队", cycle:"本周", invite:50, rebate:"₹800", wdUsers:8, pUsers:5, tUsers:3, wdAmt:"₹4,000", pAmt:"₹2,500", tAmt:"₹1,500", firstTask:6, partnerWd:2 }
];
DEMO.novice = [
  { id:"1", operator:"全局默认", key:"bind_mobile_register", title:"Bind phone number", goal:"₹0.00", reward:"₹10.00", auto:"否", inviteRel:"否", status:"正常" },
  { id:"23", operator:"全局默认", key:"cumulative_payment", title:"Umoney 4000 reward 100", goal:"₹4,000.00", reward:"₹100.00", auto:"否", inviteRel:"否", status:"正常" },
  { id:"2", operator:"全局默认", key:"join_tg_channel", title:"Join the Telegram channel", goal:"₹0.00", reward:"₹10.00", auto:"否", inviteRel:"否", status:"正常" },
  { id:"27", operator:"YLan", key:"first_earn_promotion", title:"first earn promotion", goal:"₹0.00", reward:"₹10.00", auto:"是", inviteRel:"是", status:"正常" }
];
DEMO.rankActivity = [
  { id:"A-01", operator:"YLan", title:"Weekly Invite Rank", cycle:"周", weight:"100", status:"正常" },
  { id:"A-02", operator:"全局默认", title:"October Recharge Rank", cycle:"月", weight:"80", status:"隐藏" }
];
DEMO.rankPersonal = [
  { rank:1, code:"34434224", name:"Sam57", username:"sam57", value:"₹9,350.00" },
  { rank:2, code:"32182945", name:"Joy12", username:"joy12", value:"₹5,800.00" }
];
DEMO.rankTeam = [
  { rank:1, code:"34434224", name:"Sam57", username:"sam57", value:"₹9,350.00" },
  { rank:2, code:"44643055", name:"Pro67", username:"pro67", value:"₹5,100.00" }
];
DEMO.rankInvite = [
  { rank:1, code:"44643055", name:"Pro67", username:"pro67", value:"8" },
  { rank:2, code:"34434224", name:"Sam57", username:"sam57", value:"1" }
];
DEMO.incentiveConfig = [
  { id:"IC-01", operator:"YLan", cycle:"周", title:"Withdrawal Amount111", tiers:3, summary:"团队收益 / 团队钱包 / 3档", weight:"100", enabled:"开启", wallet:"团队钱包", type:"团队收益", tierList:[{min:"500",reward:"50"},{min:"2000",reward:"200"},{min:"5000",reward:"800"}] },
  { id:"IC-02", operator:"全局默认", cycle:"日", title:"First Recharge Boost", tiers:2, summary:"一级用户个人提现 / 个人钱包 / 2档", weight:"80", enabled:"关闭", wallet:"个人钱包", type:"一级用户个人提现", tierList:[{min:"100",reward:"10"},{min:"500",reward:"50"}] }
];
DEMO.products = [
  { id:"12", operator:"全局默认", icon:"UM", name:"UMoney", type:"应用", vis:"所有用户", access:"自有", code:"royal", grant:"₹8,541,851.00", weight:"100", status:"正常" },
  { id:"8", operator:"全局默认", icon:"BC", name:"BC567", type:"游戏", vis:"所有用户", access:"自有", code:"BC567", grant:"₹8,553,362.00", weight:"100", status:"正常" },
  { id:"44", operator:"YLan", icon:"AD", name:"adjust_test", type:"游戏", vis:"测试账号", access:"Adjust", code:"adjust_test", grant:"₹76.00", weight:"95", status:"隐藏" }
];

DEMO.withdraw = [
  { id:"W-9001", request:"WD20261012001", user:"58807234", userId:"1700", operator:"YLan", wallet:"个人", amount:"₹500.00", fee:"₹10.00", actual:"₹490.00", method:"upi", accountId:"PA-01", account:"upi****15", status:"待审核", collect:"₹500.00", channelNo:"-", utr:"-", time:"2026-10-12 13:10:22" },
  { id:"W-9002", request:"WD20261011008", user:"49069325", userId:"1699", operator:"YLan", wallet:"团队", amount:"₹1,200.00", fee:"₹20.00", actual:"₹1,180.00", method:"upi", accountId:"PA-02", account:"upi****14", status:"打款中", collect:"₹1,200.00", channelNo:"CH-8821", utr:"UTR8821", time:"2026-10-11 16:42:01" },
  { id:"W-9003", request:"WD20261010003", user:"32182945", userId:"1680", operator:"YLan", wallet:"个人", amount:"₹800.00", fee:"₹10.00", actual:"₹790.00", method:"bank", accountId:"PA-03", account:"bank****24", status:"已驳回", collect:"₹800.00", channelNo:"-", utr:"-", time:"2026-10-10 09:08:44" }
];
DEMO.payoutMethods = [
  { id:"M-01", operator:"YLan", code:"upi", name:"UPI", min:"₹100", max:"₹50,000", weight:"100", status:"正常" },
  { id:"M-02", operator:"全局默认", code:"bank", name:"Bank Transfer", min:"₹500", max:"₹100,000", weight:"80", status:"正常" }
];
DEMO.payoutAccounts = [
  { id:"PA-01", operator:"YLan", code:"58807234", userId:"1700", name:"Kiran87", method:"upi", accountName:"Kiran Sharma", bankNo:"upi****15", ok:3, fail:0, def:"是", status:"正常", time:"2026-10-12 12:40:00" },
  { id:"PA-03", operator:"YLan", code:"32182945", userId:"1680", name:"Joy12", method:"bank", accountName:"Joy Kumar", bankNo:"****8824", ok:1, fail:1, def:"否", status:"禁用", time:"2026-10-02 13:00:00" }
];
DEMO.teamRewards = [
  { id:"TR-01", user:"34434224", type:"激励奖励", status:"待审核", amount:"₹2,100.00", before:"₹9,350.00", after:"-", applyTime:"2026-10-12 18:00:00", auditTime:"-", applicant:"pang" },
  { id:"TR-02", user:"44643055", type:"推广费用", status:"已完成", amount:"₹800.00", before:"₹4,300.00", after:"₹5,100.00", applyTime:"2026-09-20 11:12:00", auditTime:"2026-09-20 15:02:00", applicant:"wuyanzu" },
  { id:"TR-03", user:"50144704", type:"补偿", status:"拒绝", amount:"₹200.00", before:"₹0.00", after:"₹0.00", applyTime:"2026-09-18 09:00:00", auditTime:"2026-09-18 10:10:00", applicant:"pang" }
];
DEMO.banners = [
  { id:"B-01", operator:"YLan", title:"Diwali Bonus", pos:"首页顶部", link:"https://h5.kamaai.test/act/diwali", status:"正常" },
  { id:"B-02", operator:"全局默认", title:"New Game", pos:"活动位", link:"https://h5.kamaai.test/game/bc567", status:"隐藏" }
];
DEMO.popups = [
  { id:"POP-01", operator:"YLan", title:"绑定手机奖励", link:"https://h5.kamaai.test/bind", daily:1, interval:1440, start:"2026-10-01 00:00:00", end:"2026-12-31 23:59:59", status:"正常" }
];
DEMO.messages = [
  { id:"MSG-01", operator:"全局默认", type:"系统消息", title:"提现到账通知", link:"-", time:"2026-10-10 09:00:00", weight:"10", status:"正常" },
  { id:"MSG-02", operator:"YLan", type:"福利消息", title:"活动开启", link:"https://h5.kamaai.test/act", time:"2026-10-12 10:00:00", weight:"20", status:"隐藏" }
];
DEMO.eventTypes = [
  { id:"ET-01", name:"register", partner:"Adjust", code:"af_register", status:"正常" },
  { id:"ET-02", name:"purchase", partner:"AppsFlyer", code:"af_purchase", status:"正常" }
];
DEMO.eventDetails = [
  { id:"ED-01", type:"register", user:"58807234", product:"UMoney", channel:"facebook", time:"2026-10-12 12:36:01", status:"成功" },
  { id:"ED-02", type:"purchase", user:"32182945", product:"BC567", channel:"organic", time:"2026-10-11 18:02:44", status:"成功" }
];
DEMO.attachments = [
  { id:"F-01", name:"banner-diwali.png", cat:"分类一", type:"图片", size:"182 KB", time:"2026-10-10 09:12" },
  { id:"F-02", name:"task-icon.svg", cat:"未归类", type:"图片", size:"12 KB", time:"2026-10-08 16:40" },
  { id:"F-03", name:"withdraw-guide.mp4", cat:"分类二", type:"视频", size:"8.4 MB", time:"2026-09-30 11:20" }
];
DEMO.feedback = [
  { id:"FB-01", user:"Joy12", content:"提现到账较慢", time:"2026-10-11 19:20", status:"待处理" },
  { id:"FB-02", user:"Hari16", content:"希望增加更多任务", time:"2026-10-08 08:13", status:"已回复" }
];
DEMO.admins = [
  { id:"AD-01", name:"wuyanzu", nickname:"超管", groups:"超级管理员", status:"正常", last:"2026-10-14 20:10:00" },
  { id:"AD-02", name:"pang", nickname:"pang", groups:"运营", status:"正常", last:"2026-10-14 18:02:11" }
];
DEMO.roles = [
  { id:"RG-01", name:"超级管理员", parent:"-", users:1, menus:"全部" },
  { id:"RG-02", name:"运营", parent:"超级管理员", users:3, menus:"数据/用户/活动/资金" }
];
DEMO.menus = [
  { id:"MN-01", name:"控制台", path:"dashboard", parent:"-", status:"正常" },
  { id:"MN-02", name:"经营数据", path:"platform/stats", parent:"数据", status:"正常" },
  { id:"MN-03", name:"插件管理", path:"addon", parent:"-", status:"隐藏" }
];
DEMO.logs = [
  { id:"LG-01", admin:"wuyanzu", action:"编辑用户", target:"Kiran87", ip:"10.0.0.**", time:"2026-10-14 10:21" },
  { id:"LG-02", admin:"pang", action:"驳回提现", target:"W-9003", ip:"10.0.1.**", time:"2026-10-12 19:08" }
];
DEMO.settings = {
  siteName:"Kamaai Center",
  beian:"-",
  version:"2.4.1",
  timezone:"Asia/Shanghai",
  lang:"简体中文",
  smtp:"smtp.kamaai.test",
  mailFrom:"noreply@kamaai.test"
};
DEMO.appConfigs = [
  { id:"APP-01", platform:"Android", version:"2.4.1", force:"否", note:"性能优化", status:"正常" },
  { id:"APP-02", platform:"iOS", version:"2.4.0", force:"是", note:"紧急修复", status:"正常" }
];
DEMO.profile = { name:"wuyanzu", mobile:"138****0000", email:"admin@kamaai.test", nickname:"超管" };
DEMO.siteConfig = {
  personalTiers:["100","500","1000"],
  teamTiers:["500","2000"],
  withdrawPct:"2",
  withdrawFee:"10",
  firstFree:"是",
  auditRatio:"30",
  validUser:"3"
};
