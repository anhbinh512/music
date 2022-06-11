tconst heading = document.querySelector('header h2')
const cdThumb = document.querySelector('.cd-thumb')
const audio = document.getElementById('audio')
const cd = document.querySelector('.cd')
const playBtn = document.querySelector('.btn-toggle-play')
const playing = document.querySelector('.player')
const playList = document.querySelector('.playlist')
const progress = document.querySelector('.progress')
const prevBtn = document.querySelector('.btn-prev')
const nextBtn = document.querySelector('.btn-next')
const btnRandom = document.querySelector('.btn-random')
const btnRepeat = document.querySelector('.btn-repeat')
const btnOption = document.querySelector('.btn-option')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{

            name: 'Gieo Quẻ',
            single: 'Hoàng Thùy Linh',
            path: './assets/music/song1.mp3',
            image: 'https://giaxeototphcm.net/uploads/pham-minh-hieu_1632791087/hoangthuylinh/clipnonghoangthuylinh005.jpg'
        },
        {
            name: 'Chạy Về Khóc Cùng Anh',
            single: 'Erik',
            path: './assets/music/song2.mp3',
            image: 'https://data.chiasenhac.com/data/cover/155/154074.jpg'
        },
        {
            name: 'Câu Nói Chưa Vẹn Tròn ',
            single: 'T4',
            path: './assets/music/song3.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/09/23/b/9/f/5/1632384189938.jpg'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn ',
            single: 'Sơn Tùng MTP',
            path: './assets/music/song4.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/04/29/9/1/f/8/1619691182261.jpg'
        },
        {
            name: 'Cưới Thôi',
            single: 'Masew',
            path: './assets/music/song5.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/09/09/f/c/f/d/1631181753902.jpg'
        },
        {
            name: 'Có Hẹn Với Thanh Xuân ',
            single: 'Monstar',
            path: './assets/music/song6.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/07/16/f/4/9/8/1626425507034.jpg'
        },

    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.single}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `

        })
        playList.innerHTML = htmls.join('');
    },
    renderSupport: function() {
        const html = this.songs.map(option => {
            return `
            <div class="option_support">
            <ul class="option_list">
                <li class="option_items">
                    <i class="far fa-cloud-download-alt"></i>

                </li>
                <li class="option_items">

                </li>
                <li class="option_items"></li>
            </ul>
        </div>
            `
        })
        btnOption.innerHTML = html.join('')
    },

    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }


        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()

            } else {
                audio.play()
            }
        }
        audio.onplay = function() {
            app.isPlaying = true
            playing.classList.add("playing")
            cdThumbmate.play()
        }
        audio.onpause = function() {
            app.isPlaying = false
            playing.classList.remove("playing")
            cdThumbmate.pause()
        }

        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPecent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPecent
                }
            }
            // progress.onchange = function(event) {
            //     const seekTime = audio.duration / 100 * event.target.value
            //     audio.currentTime = seekTime
            // }
        progress.onchange = function(event) {
            audio.currentTime = audio.duration / 100 * event.target.value
        }

        const cdThumbmate = cdThumb.animate([{
                transform: 'rotate(360deg)'
            }

        ], {
            duration: 20000,
            interation: Infinity
        })
        cdThumbmate.pause()

        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.randomPlaySong()

            } else {

                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()


        }
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.randomPlaySong()
            } else {

                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        btnRandom.onclick = function() {
            app.isRandom = !app.isRandom
            btnRandom.classList.toggle('active', this.isRandom)

            audio.play()

        }
        audio.onended = function() {
            app.nextSong()
            audio.play()
        }
        btnRepeat.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            btnRepeat.classList.toggle('active', this.isRepeat)
        }
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                app.nextSong()
                audio.play()
            }
        }
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')
            if (songNode || songOption) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()

                }
                if (songOption) {
                    app.renderSupport()
                }
            }
        }



    },
    loadCurrentSong: function() {


        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++

            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--

            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },

    randomPlaySong: function() {
        let newRandom
        do {

            newRandom = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newRandom)
        this.currentIndex = newRandom

        this.loadCurrentSong()

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            const scrollToActive = document.querySelector('.song.active')
            scrollToActive.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            }, 300)

        })

    },



    start: function() {
        this.handleEvent()
        this.defineProperty()
        this.loadCurrentSong()
        this.render()
    }

}
app.start();