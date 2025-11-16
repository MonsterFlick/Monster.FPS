// MENU TOGGLE
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav__list')

    document.getElementById('nav-toggle')?.addEventListener('click', () => {
        nav.classList.toggle('show')
    })
})

// SCROLL REVEAL
try {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 2000,
        reset: true
    })

    sr.reveal('.home__title', {})
    sr.reveal('.home__img', { origin: 'right', delay: 300 })
} catch (e) {
    console.warn('ScrollReveal not found')
}

// DOWNLOAD BUTTON ANIMATION
const downloadBtn = document.querySelector('.download-btn')
if(downloadBtn){
    downloadBtn.addEventListener('click', (e) => {
        downloadBtn.classList.add('animate')
        setTimeout(() => downloadBtn.classList.remove('animate'), 1400)
    })
}