import { useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import skills from '../../skill.json'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const initialDatasets = {
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

const initialGraphsData = [
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

const initialLevels = skills.map((item) => {
  return { label: item.label, level: 1 }
})

export const SkillChart: React.FC = () => {
  const [levels, setLevels] = useState<{ label: string; level: number }[]>(initialLevels)
  const [graphsData, setGraphsData] = useState(initialGraphsData)

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
    setGraphsData(
      graphsData.map((graph, index) => {
        return {
          ...graph,
          datasets: [
            {
              ...graph.datasets[0],
              data: graph.labels.map((label) => {
                const level = levels.find((item) => item.label === label)
                return level ? level.level : 1
              }),
            },
          ],
        }
      }),
    )
  }, [levels])

  return (
    <>
      <h2>スキル一覧</h2>
      {skills.map((skill, parentIndex) => (
        <div key={parentIndex}>
          <h3>{skill.label}</h3>
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
        </div>
      ))}
      <hr />
      <h2>スキルグラフ</h2>
      <p>スキル一覧で選択したスキルデータを分野別にグラフ出力しています。</p>
      {graphsData.map((graphData, index) => (
        <div key={index} style={{ width: '500px', height: '500px' }}>
          <h3>{graphData.name}</h3>
          <Radar
            data={graphData}
            options={{
              scales: {
                r: {
                  max: 5,
                  min: 0,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      ))}
    </>
  )
}
