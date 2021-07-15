//global variables
const overviewElement = document.querySelector(".overview"); //where profile information will appear
const username = "iamsummerflowers";
const repoList = document.querySelector(".repo-list"); //display repo list
const reposElement = document.querySelector(".repos"); //where repo information appears
const repoDataElement = document.querySelector(".repo-data"); //where individual repo data will appear
const repoGalleryButton = document.querySelector(".view-repos"); //back to Repo Gallery button
const filterInput = document.querySelector(".filter-repos"); //helps to search




//fetch API JSON data
const apiUrl = `https://api.github.com/users/${username}`;
const grabGitInfo = async function () {  
    const userInfo = await fetch (apiUrl);
    const data = await userInfo.json();
    displayUserInfo(data);
    //console.log(data); //- log test (LT) to log out url data
}

grabGitInfo();

//display and fetch user info on page
const displayUserInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>
    `;
    overviewElement.append(div);
    //console.log(div); //- log test (LT) to log out url data
    grabRepos();
};

//grabs url information and displays repos based on url
const grabRepos = async function() {
    const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    displayRepos(repoData);
};

//help display repo information
displayRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

//listens for click of repo lists
repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        grabRepoInfo(repoName);
    }
});

//grabs repo information from specific repo and then calls to display it
const grabRepoInfo = async function(repoName) {
    const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);

    //create an array of languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
        console.log(languages);
    }
    displayRepoInformation(repoInfo, languages); 
};

//help display repo information
const displayRepoInformation = async function (repoInfo, languages) {
    repoGalleryButton.classList.remove("hide");
    repoDataElement.innerHTML = "";
    repoDataElement.classList.remove("hide");
    reposElement.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoDataElement.append(div);
};

//button to go back to Repo Gallery
repoGalleryButton.addEventListener("click", function(){
    reposElement.classList.remove("hide");
    repoDataElement.classList.add("hide");
    repoGalleryButton.classList.add("hide");
});


//create dynamic search functionality
filterInput.addEventListener("input", function(e){
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();

    for(const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
        if( repoLowerText.includes(searchLowerText)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});