
module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'site-bg': "#FFF3EA",
                'site-theme': '#ff8c00',
                'branding-color-red': '#CF278D',
                'branding-color-blue': '#354895',
                'branding-color-yellow': '#EFAD1E',
                'branding-color-orange': '#F36F27',
                'theme-bg-color': '#FFF3EA',
                'general-button-outline': '#ff8c00',
                'section-bg-light': '#ECEEFF',
                'box': '#1D2B79',
                'date': '#BF2B83',
                'date-box': '#FFE2F3',
                'light-orange': '#FFF9F9',
                'footer': ' #E4EDF4',
                'tabBody': '#F9F9F9',
                'gradians': '#C4C4C4',


            },
            textColor: {
                'headline': '#434343',
                'title': '#323862',
                'news': '#CF278D',


            },
            borderWidth: {
                '1': '1.1px',

            },
            backgroundImage: theme => ({
                // 'hero-md': "url('/images/cover.svg')",
                // 'hero-sm': "url('/images/cover-sm.svg')",
                // 'footer-sm': "url('/slide/girl.png')",
                // 'onker-jahaj':"url('/images/onkerjahajbackground.svg')",
                // 'login-bg':"url('/images/login-bg.svg')",
                //  'redCircle':"url('/images/slider/redCircle.svg')",
                //  'video-bg':"url('/images/slider/video-bg.svg')",
            }),
            fontSize: {
                '42px': '42px',
                '40px': '40px',
                '32px': '32px',
                '30px': '30px',
                '24px': '24px',
                '20px': '20px',
                '14px': '14px',
                '18px': '18px',
                '10px':'10px',
            },
            fontFamily: {
                bangla: ['Hind+Siliguri'],
                title: [' "Noto Sans"']
            },
            transitionDuration: {
                '2sec': '2000ms',
            },
            zIndex: {
                'minus': '-1',
            },
            lineHeight: {
                '61px': '3.8rem',
                '48px': '48px',
                '36px': '36px',
                '29px': '29px'
            },
            height: {
                'ex-large': '31rem',
                'card': '220px',
                '110p': '140%',
                '596px': '596px',
                '500px': '520px',
                '90p': '90%',
                'half': '50%',
                '401px': '401px',
                'phone': '580px',
                '2p': '3%',
                '98p': '97%',
            },

            width: {
                '1/7': '14.2857143%',
                '2/7': '40%',
                '3/7': '42.8571429%',
                '4/7': '57.1428571%',
                '5/7': '71.4285714%',
                '6/7': '85.7142857%',
                '90': '90%',
                'half': '50%',
                '70': '70%',
                '60p': '60%',
                '110px': '110px',
                '578px': '4008px',


            },
            stroke: theme => ({
                'white': theme('colors.white'),
            }),

            margin: {
                'right50': '24rem',
                '35p':'35%',
            },
            borderRadius: {
                'custom': '40px',
                'half': '50%',
                '10p': '10%',
                '12p': '12%',
                '15p': '15%',
                '50px': '50px',
                '20px': '20px',
                'DEFAULT': '12px',
            },
            borderColor: {
                'outline-color': '#ff8c00',
                'active': '#CF278D'
            },
            inset: {
                '1/20': '5%',
                '4p': '4%',
                '9p': '9%',
                '10p': '10%',
                '74': '74%',
                '40': '40%',
                '76': '76px',
                '46': '46px',
                '50': '50%',
                'fluid-video': '56.25%',
                'customCalc': 'calc(50% - 6rem)'
            },
            maxWidth: {
                '10': '10rem',
                '20': '20rem',
                '15': '15rem',

            },
            maxHeight: {
                '8': '8rem',
                '36rem': '36rem',
                '12rem': '12rem',
            },

            animation: {

                left: 'left 0.3s',

                right: 'right 0.3s',

            },
            keyframes: {

                left: {
                    '0%, 100%': {transform: 'translateX(-100%)'},
                    '100%': {transform: 'translateX(0)'},
                },
                right: {
                    '0%, 100%': {transform: 'translateX(100%)'},
                    '100%': {transform: 'translateX(0)'},
                },


            }

        }
    },
    variants: {
        extend: {
            backgroundColor: ['active', 'checked'],
            inset: ['checked'],
            opacity: ['disabled'],
            textColor: ['active'],
        },
    },
    images: {
        domains: ['shikho.tech'],
    },


    plugins: [],
}
