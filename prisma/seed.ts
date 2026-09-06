import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const papers = [
  {
    title: "Effects of cervical proprioception on postural control",
    authors: "Smith J, Tanaka K, et al.",
    journal: "Journal of Vestibular Research",
    year: 2024,
    doi: "10.1234/jvr.2024.001",
    studyDesign: "Cross-sectional study",
    subjects: "健常成人 42名\n平均年齢 24.3 ± 3.2歳",
    summary: "頸部への感覚刺激が姿勢制御および前庭機能に与える影響を検討。",
    outcomes: "Fukuda stepping test,VOR,COP,SLS",
    mainResults:
      "刺激条件によって身体偏倚が変化。VOR gainとの関連を認めた。\nr = 0.74, p = 0.013",
    isFavorite: true,
    isAiSummary: true,
    relevanceRating: 5,
    relevanceNote: "足踏み検査・ハンガー反射の背景に使えそう",
    usageLabels: ["背景に使えそう"],
    tags: ["前庭", "足踏み検査", "姿勢制御"],
  },
  {
    title:
      "Hanger reflex and vestibular-evoked postural adjustment during stepping",
    authors: "Yamamoto R, Lee S",
    journal: "Gait & Posture",
    year: 2023,
    doi: "10.1234/gp.2023.045",
    studyDesign: "Randomized controlled trial",
    subjects: "健常成人 30名\n平均年齢 27.1 ± 4.0歳",
    summary:
      "ハンガー反射刺激がFukuda stepping testにおける回転角に与える影響を検討したRCT。",
    outcomes: "Fukuda stepping test,回転角,COP",
    mainResults: "刺激群において回転角が有意に減少した。\np = 0.021",
    isFavorite: false,
    isAiSummary: true,
    relevanceRating: 4,
    relevanceNote: "方法(刺激条件の設定方法)の参考になる",
    usageLabels: ["方法の参考", "結果比較に使えそう"],
    tags: ["前庭", "足踏み検査", "ハンガー反射"],
  },
  {
    title: "Weight-bearing lunge test as a proxy for postural stability",
    authors: "Chen H, Park J",
    journal: "Physical Therapy Research",
    year: 2022,
    doi: "10.1234/ptr.2022.099",
    studyDesign: "Cohort study",
    subjects: "スポーツ選手 60名\n平均年齢 21.8 ± 2.5歳",
    summary: "WBLTと動的姿勢制御能力の関連を1年間追跡したコホート研究。",
    outcomes: "WBLT,COP,片脚立位時間",
    mainResults: "WBLT可動域と片脚立位時間に中程度の相関を認めた。\nr = 0.52",
    isFavorite: false,
    isAiSummary: false,
    relevanceRating: 3,
    relevanceNote: "評価項目の選定における参考",
    usageLabels: ["方法の参考"],
    tags: ["姿勢制御", "WBLT"],
  },
  {
    title: "Vestibular contribution to standing balance in older adults",
    authors: "Nakamura T, Fischer A, et al.",
    journal: "Clinical Biomechanics",
    year: 2021,
    doi: "10.1234/cb.2021.077",
    studyDesign: "Case-control study",
    subjects: "高齢者 50名 / 若年成人 50名",
    summary: "高齢者と若年成人における前庭機能と立位バランスの関係を比較。",
    outcomes: "VOR,COP,重心動揺",
    mainResults:
      "高齢者群でVOR gainの低下と重心動揺の増大が認められた。\np < 0.001",
    isFavorite: false,
    isAiSummary: false,
    relevanceRating: 2,
    relevanceNote: "考察での年齢差の議論に使えそう",
    usageLabels: ["考察に使えそう"],
    tags: ["前庭", "加齢"],
  },
];

async function main() {
  for (const p of papers) {
    const { tags, ...data } = p;
    await prisma.paper.upsert({
      where: { doi: data.doi },
      update: {},
      create: {
        ...data,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
  }
  console.log(`Seeded ${papers.length} papers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
