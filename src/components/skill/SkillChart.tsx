import { useState, useEffect } from 'react'
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { skillData, initialGraphsData, initialLevels } from './Skilldata'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

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
      {skillData.map((skill, parentIndex) => (
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
        <div key={index} style={{ width: '600px', height: '600px' }}>
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
                  angleLines: {
                    display: false,
                  },
                  pointLabels: {
                    display: true,
                    callback: (value) => {
                      const maxLength = 10
                      return value.length > maxLength ? value.slice(0, maxLength) + '...' : value
                    },
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
