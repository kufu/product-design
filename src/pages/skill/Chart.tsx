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

type MyObject = {
  [key: string]: number
}

const initialLevels: MyObject = {
  ...skills.reduce((acc, skill, parentIndex) => {
    const skillLevels = skill.levels.map(() => ({
      [`skill${parentIndex}`]: 1,
    }))
    return { ...acc, ...Object.assign({}, ...skillLevels) }
  }, {}),
}

export const Bar: React.FC = () => {
  const [levels, setLevels] = useState<MyObject>(initialLevels)
  const [graphData, setGraphData] = useState(initialGraphData)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setLevels({ ...levels, [name]: Number(value) })
    setGraphData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [Number(value), 1, 1, 1],
        },
      ],
    }))
  }
  useEffect(() => {
    console.log(levels)
  }, [levels])

  return (
    <div>
      {skills.map((skill, parentIndex) => (
        <section key={parentIndex}>
          <h2>
            <a href={`/wiki/${skill.label}`}>{skill.label}</a>
          </h2>
          <ol>
            {skill.levels.map((level, levelNumber) => (
              <li key={levelNumber}>
                <input
                  type="radio"
                  id={`skill${parentIndex}-${levelNumber}`}
                  name={`skill${parentIndex}`}
                  value={levelNumber + 1}
                  onChange={onChange}
                  defaultChecked={levelNumber === 0}
                />
                <label htmlFor={`skill${parentIndex}-${levelNumber}`}>{level}</label>
              </li>
            ))}
          </ol>
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
