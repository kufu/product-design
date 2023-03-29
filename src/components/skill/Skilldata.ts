import skill from '../../data/skill.json'

export const skillData = skill

const initialDataSets = {
  datasets: [
    {
      label: 'スキル',
      data: [1, 1, 1, 1],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
  ],
}

export const initialGraphsData = [
  {
    name: 'コア',
    labels: ['行政手続きの知識', '給与計算および税制の知識', '既存プロダクトの理解', 'ファシリテーション能力'],
    ...initialDataSets,
  },
  {
    name: 'UI',
    labels: [
      'HTMLの理解',
      'CSSの理解',
      'オブジェクトモデリング',
      'ブラウザの理解',
      '画面設計能力',
      'レガシー画面設計能力',
      'アクセシビリティの知識',
      'QA能力',
      'ビジュアルデザインの知識と理解',
      'デザインツールの知識',
      'プロトタイピング能力',
      'ユーザビリティの知識と理解',
    ],
    ...initialDataSets,
  },
  {
    name: 'UX',
    labels: [
      '支援技術の知識と理解',
      '全体設計能力',
      'HCD/UXDの知識と理解 as UXD',
      'ブラウザの理解',
      '画面設計能力',
      'レガシー画面設計能力',
      'アクセシビリティの知識',
      'QA能力',
      'ビジュアルデザインの知識と理解',
      'デザインツールの知識',
      'プロトタイピング能力',
      'ユーザビリティの知識と理解',
    ],
    ...initialDataSets,
  },
  {
    name: 'フロントエンド',
    labels: [
      'HTMLの理解',
      'CSSの理解',
      'オブジェクトモデリングの理解',
      'ブラウザの理解',
      'アクセシビリティの知識と理解',
      '支援技術の知識と理解',
      '全体設計能力',
      'JavaScriptの理解',
      'ウェブクライアントサイドの設計能力',
      'QA能力',
      'プロトタイピング能力',
    ],
    ...initialDataSets,
  },
  {
    name: 'PdM（プロダクトマネージャー）',
    labels: [
      'オブジェクトモデリングの理解',
      'ブラウザの理解',
      '支援技術の知識と理解',
      '全体設計能力',
      'コンテンツ企画および計画能力',
      '戦略課題分析および立案',
      'ユーザー調査の知識と実施能力',
      'ユーザビリティ評価やユーザーテスト実施能力',
      'ユーザーの利用状況やメンタルモデルに関する知識と理解',
      '全体調整能力',
      'QA能力',
      'デザインツールの知識',
      'プロトタイピング能力',
      'ユーザビリティの知識と理解',
    ],
    ...initialDataSets,
  },
  {
    name: 'IA',
    labels: [
      'オブジェクトモデリングの理解',
      'アクセシビリティの知識と理解',
      '全体設計能力',
      'コンテンツ編集能力',
      'コンテンツ企画および計画能力',
      '全体調整能力',
      'ユーザビリティの知識と理解',
    ],
    ...initialDataSets,
  },
]

export const initialLevels = skillData.map((item) => {
  return { label: item.label, level: 1 }
})
