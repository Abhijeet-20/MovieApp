const API_KEY = "api_key=d1df5997cc3797de1b53109f0a14d1d4";
const URL = "https://api.themoviedb.org/3";
const API_URL = URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const imgUrl = "https://image.tmdb.org/t/p/w500";
const searchUrl = URL + '/search/movie?' + API_KEY;

const main = document.querySelector('.all');
const input = document.getElementById('input-search');
const btn = document.getElementById('btn');

const imgsearch = document.querySelector('.imgs');

function reload(){
    window.reload();
}

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ];

const tags =document.getElementById('tags');
var selectedGenre = [];

function setGenre(){
    tags.innerHTML = '';
    genres.forEach(genre =>{
        const ele = document.createElement('div');
        ele.classList.add('tags');
        ele.id = genre.id;
        ele.innerHTML = genre.name;
        ele.addEventListener('click',()=>{
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }
            else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx)=>{
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }
                else{
                    selectedGenre.push(genre.id);
                }
            }
            // console.log(selectedGenre);
            fetchmovie(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')));
            highlight();
        });
        tags.append(ele);
    });
    
}
setGenre();

function highlight(){
    const tags = document.querySelectorAll('.tags');
    tags.forEach(tag =>{
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id =>{
            const highlightTag = document.getElementById(id);
            highlightTag.classList.add('highlight');
        })
    }
    
}
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tags','highlight');
        clear.id = 'clear';
        clear.innerText = '🗙';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            fetchmovie(API_URL);
        })
        tags.append(clear);
    }
}

async function fetchmovie(API_URL){
    const res = await fetch(`${API_URL}`);
    const data = await res.json();
    console.log(data.results);
    if(data.results.length !==0 ){
        showmovie(data.results);
    }else{
        main.innerHTML='<h1>No Results Found</h1>'
    }
    
}
fetchmovie(API_URL);

function showmovie(data){
    main.innerHTML='';

    data.forEach(movie =>{
        const {title , poster_path , vote_average , overview} = movie;
        const movieEle = document.createElement('div');
        movieEle.classList.add('main');
        movieEle.innerHTML = `
        <div class="movie">
            <img src="${poster_path? imgUrl+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
        </div>
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            <p>${overview}</p>
        </div>
        `

        main.appendChild(movieEle);
    });
}

function getColor(vote){
    if(vote>=8){
        return 'green';
    }
    else if(vote>=5){
        return 'orange';
    }
    else{
        return 'red';
    }
}

btn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchterm = input.value;
    selectedGenre= [];
    setGenre();
    if(searchterm){
        fetchmovie(searchUrl+'&query='+searchterm);
    }
    else{
        fetchmovie(API_URL);
    }
});
