export const doughnutLegends = [
  { title: 'Rejected', color: '300771' },
  { title: 'Pending', color: '#2b7fb2' },
  { title: 'Users', color: 'green' },
  { title: "Unapplied", color: "red" },
]

export const lineLegends = [
  { title: 'Sent', color: 'bg-teal-600' },
  { title: 'Paid', color: 'bg-purple-600' },
]


export const doughnutOptions = {
  data: {
  datasets: [
  {
  data: [35, 200, 80, 600],
  /**
  * These colors come from Tailwind CSS palette
  * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
  */
  backgroundColor: ["#300771", "#2b7fb2", "#7ae3d7", "#F77B06"],
  label: "Users",
  },
  ],
  labels: ["Rejected", "Pending", "Users", "Unapplied"],
  },
  // width:60,
  // height:40,
  options: {
  // maintainAspectRatio: false,

  responsive: true,
  // height:100,
  cutoutPercentage: 80,
  },
  legend: {
  display: true,
  },
 };

export const lineOptions = {
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Organic',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      {
        label: 'Paid',
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#7e3af2',
        borderColor: '#7e3af2',
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
  options: {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
  legend: {
    display: false,
  },
}

export const barOptions = {
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Shoes',
        backgroundColor: '#0694a2',
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
      {
        label: 'Bags',
        backgroundColor: '#7e3af2',
        // borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [66, 33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
}
