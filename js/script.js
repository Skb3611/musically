Access-Control-Allow-Origin: *
let currentsong = new Audio();
let songs=[]
let folders=[]
let audio=new Audio()
let play = document.getElementById("play")
let Currentfolder="Animal"
currentsong.volume=0.5;

async function get_songs(folder) {
    let temp = []
    let a = await fetch(`assets/Songs/${folder}`)
    let responce = await a.text()
    // console.log(responce)
    let div = document.createElement("div")
    div.innerHTML = responce
    let as = div.getElementsByTagName("a")
    // console.log(as)
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            temp.push(element.href)
        }
    }
    return temp
    rendering_song()

   
}
function    playmusic(track) {
    // let audio=new Audio("/assets/songs/%5BSPOTIFY-DOWNLOADER.COM%5D%20"+track)
    if(track.includes(`/assets/Songs/${Currentfolder}/%5BSPOTIFY-DOWNLOADER.COM%5D%20`)){
        currentsong.src=track;
    }
    else currentsong.src = `/assets/Songs/${Currentfolder}/%5BSPOTIFY-DOWNLOADER.COM%5D%20` + track+".mp3";
    currentsong.play()
    play.src = "assets/Images/pause.svg"
    let name = document.getElementsByClassName("song-name")[0]

    name.innerHTML = currentsong.src.split(".COM")[1].replaceAll("%20", " ").replaceAll("%5D", " ")


    // assets/songs/%5BSPOTIFY-DOWNLOADER.COM%5D%20Arjan%20Vailly.mp3
    // assets/Songs/%5BSPOTIFY-DOWNLOADER.COM%5DArjan%20Vailly.mp3a
  
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getFolders(){
    let temp=[]
    temp=await fetch("assets/songs/")
    let responce=await temp.text()
    let div=document.createElement("div")
    div.innerHTML=responce
    // div.getElementsByTagName("li")
    let anchors=div.getElementsByTagName("a")
    Array.from(anchors).forEach(e=>{
        if(e.href.includes("assets/songs/")){
            folders.push(e.href)
        }
    })
    // console.log(div.getElementsByTagName("a"))
}
    // playlist rendering logic
async function rendering_song(albumname){
    // songs = await get_songs("Animal")

    let playlist = document.querySelector(".container")
    playlist.innerHTML=""
    for (const iterator of songs) {
        // let albumname=""
        let songname = iterator.split(".COM")[1].replaceAll("%20", " ").replaceAll("%5D", " ").replaceAll(".mp3","")
        audio.src=  `${iterator}`
        playlist.innerHTML += `<div class="playlist-item pointer">
        <img src="assets/Images/music.svg" class="invert" alt="">
        <div class="song-info">
        <div>${songname}</div>
        <div>${albumname}</div>
        </div>
        <img src="assets/Images/play.svg" class="invert" alt="">
        </div>`
    }
    Array.from(document.querySelectorAll(".playlist-item")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".song-info").firstElementChild)
            playmusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim())
        })
    })
}

// main
songs = [];
async function main() {
    await getFolders()
    rendering_song()
    // console.log(songs)
    songs=await get_songs("Animal")
    rendering_song("Animal")


  
    // playlist click to play 
  
    // Play pause logic
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "assets/Images/pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "assets/Images/play.svg"
        }
    })
    let seekbar=document.querySelector("#seekbar")
    let duration = document.querySelector("#duration")
    let currenttime = document.querySelector("#currenttime")
    currentsong.addEventListener("timeupdate", () => {
        duration.innerHTML = secondsToMinutesSeconds(currentsong.duration)
        currenttime.innerHTML = secondsToMinutesSeconds(currentsong.currentTime)
  
    seekbar.value=`${(currentsong.currentTime)/(currentsong.duration)*100}`;
    })
    
    seekbar.addEventListener("change",()=>{
        console.log((currentsong.duration/seekbar.value)*100,seekbar.value)
        currentsong.currentTime=(currentsong.duration*seekbar.value)/100
        // currenttime.innerHTML=

    })
    let next=document.querySelector("#next")
    let prev=document.querySelector("#prev")

    next.addEventListener("click",()=>{
        // console.log(currentsong.src,songs)
        let index=songs.indexOf(currentsong.src)
        if(index<songs.length){
            playmusic(songs[index+1])
        }    
    })
    prev.addEventListener("click",()=>{
        // console.log(currentsong.src,songs)
        let index=songs.indexOf(currentsong.src)
        if(index>=0){
            playmusic(songs[index-1])
        }    
    })
 
    
    let volume =document.querySelector(".playbar-right").firstElementChild
    let volume_bar=document.querySelector(".playbar-right").getElementsByTagName("input")[0]
    volume_bar.addEventListener("change",(e)=>{
        currentsong.volume=(e.target.value)/100
        console.log(e.target.value,currentsong.volume)
        if(currentsong.volume==0){
            volume.src="assets/Images/mute.svg"
        }
        else volume.src="assets/Images/volume.svg"
    })
    volume.addEventListener("click",(e)=>{
     if (volume.src=="assets/Images/volume.svg") {
        volume.src="assets/Images/mute.svg"
        currentsong.volume=0
        volume_bar.value=0
     }
     else{
        volume.src="assets/Images/volume.svg"
        currentsong.volume=0.5
        volume_bar.value=50
     }
     
    })
// -----------------------------------------------------------------------------------
// Rendering folders
let cards_container=document.querySelector(".cards-container")
for (const iterator of folders) {
    let foldername=decodeURI(iterator.split("assets/songs/")[1])
    let noOfSongs=await get_songs(decodeURI(iterator.split("assets/songs/")[1]))
    console.log(iterator)
    cards_container.innerHTML+=`<div data-folder="${foldername}"class="card pointer">
    <img class="img-width" src="assets/Songs/${foldername}/cover.jpg" alt="">
    <span class="title">${foldername}</span>
    <span class="desc">No of Songs: ${noOfSongs.length}</span>
    </div>`
}
let cards=document.querySelectorAll(".card")
console.log(folders)
Array.from(cards).forEach(card=>{
    card.addEventListener("click",async e=>{
        let foldername=e.currentTarget.dataset.folder.replaceAll(" ","%20")
        Currentfolder=foldername
        console.log(foldername)
        songs=await get_songs(foldername)
         rendering_song(decodeURI(foldername))
         playmusic(songs[0])
    })
})

let hamburger=document.querySelector(".ham")
document.querySelector(".left")
let close=document.querySelector(".close")

console.log(hamburger,document.querySelector(".left"))
hamburger.addEventListener("click",()=>{
    document.querySelector(".left").style.left="0%"
    hamburger.style.display="none"
})
close.addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%"
    hamburger.style.display="inline"

})
}



main()
