import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import * as faker from "faker";

function ChartExp({ bg, Mode, d }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Monthly Expences",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // if (labels.includes(d.month[0].month)) {
  //     return d.month[0].amount;
  //   } else {
  //     return 0;
  //   }
  // const setData = labels?.map((m) => {
  //   const newData = d?.map((i) => {
  //     if (m === i.month[0].month) {
  //       return i.month[0].amount;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   return newData;
  // });
  const setData = labels.map((label) => {
    const matchingItem = d?.find((item) => item.month[0].month === label);
    return matchingItem ? matchingItem.amount : 0;
  });

  console.log(setData);

  const data = {
    labels,
    datasets: [
      {
        label: "Expence in Rs",
        data: setData,
        backgroundColor: bg,
      },
    ],
  };

  return (
    <Mode
      options={options}
      data={data}
      // style={{ width: "100%", height: "50vh" }}
    />
  );
}

export default ChartExp;
