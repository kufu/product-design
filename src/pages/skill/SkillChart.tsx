import { ChangeEvent, useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import skills from '../../skill.json'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const initialGraphData = {
  labels: ['行政手続きの知識', '給与計算および税制の知識', '既存プロダクトの理解', 'ファシリテーション能力'],
  datasets: [
    {
      label: '# of Votes',
      data: [1, 1, 1, 1],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
  ],
}

const initialDatasets = {
  datasets: [
    {
      label: '# of Votes',
      data: [1, 1, 1, 1],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
  ],
}

const hoge = [
  {
    name: 'コア',
    labels: ['行政手続きの知識', '給与計算および税制の知識', '既存プロダクトの理解', 'ファシリテーション能力'],
    ...initialDatasets,
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
      'ユーザビリティの知識',
    ],
    ...initialDatasets,
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
      'ユーザビリティの知識',
    ],
    ...initialDatasets,
  },
]

const graph1 = ['行政手続きの知識', '給与計算および税制の知識', '既存プロダクトの理解', 'ファシリテーション能力']

const initialLevels = skills.map((item) => {
  return { label: item.label, level: 1 }
})

console.log(initialLevels)

export const SkillChart: React.FC = () => {
  const [levels, setLevels] = useState<{ label: string; level: number }[]>(initialLevels)
  const [graphData, setGraphData] = useState(initialGraphData)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const dataIndex = levels.findIndex((item) => item.label === name)

    if (dataIndex === -1) {
      setLevels([...levels, { label: name, level: Number(value) }])
    } else {
      setLevels(
        levels.map((item, index) => {
          if (index === dataIndex) {
            return { label: name, level: Number(value) }
          }
          return item
        }),
      )
    }
  }

  useEffect(() => {
    setGraphData((prevData) => ({
      ...prevData,
      labels: graph1,
      datasets: [
        {
          ...prevData.datasets[0],
          data: levels.filter((item) => graph1.some((str) => item.label === str)).map((item) => item.level),
        },
      ],
    }))
    console.log(graph1)
  }, [levels])

  return (
    <div>
      {skills.map((skill, parentIndex) => (
        <section key={parentIndex}>
          <h2>{skill.label}</h2>
          {skill.description && <p>{skill.description}</p>}
          <ul>
            {skill.levels.map((level, levelNumber) => (
              <li key={levelNumber}>
                <input
                  type="radio"
                  id={`skill${parentIndex}-${levelNumber}`}
                  name={skill.label}
                  value={levelNumber + 1}
                  onChange={onChange}
                  defaultChecked={levelNumber === 0}
                />
                レベル{levelNumber + 1}
                <ul>
                  <li>
                    <label htmlFor={`skill${parentIndex}-${levelNumber}`}>{level}</label>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h2>行政手続きの知識</h2>
      <Radar
        data={graphData}
        options={{
          scales: {
            r: {
              max: 5, //グラフの最大値
              min: 0, //グラフの最小値
              ticks: {
                stepSize: 1, //目盛間隔
              },
            },
          },
        }}
      />
    </div>
  )
}
