
import "./src/styles/global.scss"

// NOTE: In case page-transitions cause scrolling error (see: https://www.digitalocean.com/community/tutorials/how-to-animate-page-transitions-on-a-static-gatsbyjs-site)
// const transitionDelay = 500

// exports.shouldUpdateScroll = ({
//     routerProps: { location },
//     getSavedScrollPosition,
// }) => {
//     if (location.action === 'PUSH') {
//         window.setTimeout(() => window.scrollTo(0, 0), transitionDelay)
//     } else {
//         const savedPosition = getSavedScrollPosition(location)
//         window.setTimeout(
//             () => window.scrollTo(...(savedPosition || [0, 0])),
//             transitionDelay
//         )
//     }
//     return false
// }