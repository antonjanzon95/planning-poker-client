const app = document.getElementById('app');

export function superadminLogin() {
    const superadminBtn: HTMLButtonElement = document.createElement('button');
    superadminBtn.innerText = 'Admin';
    superadminBtn.classList.add('superadminBtn');
    app!.append(superadminBtn);

    superadminBtn.addEventListener('click', () => {
        renderSuperadminLoginForm()
    });
}

function renderSuperadminLoginForm() {
    const superadminLoginForm: HTMLFormElement = document.createElement('form');
    const heading: HTMLHeadingElement = document.createElement('h1');
    const username: HTMLInputElement = document.createElement('input');
    const password: HTMLInputElement = document.createElement('input');
    const usernameLabel: HTMLLabelElement = document.createElement('label');
    const passwordLabel: HTMLLabelElement = document.createElement('label');
    const superadminLoginBtn: HTMLButtonElement = document.createElement('button');
    const loginMsg: HTMLParagraphElement = document.createElement('p');
    
    heading.innerHTML = 'Logga in';
    usernameLabel.innerHTML = 'Användarnamn';
    passwordLabel.innerHTML = 'Lösenord';
    superadminLoginBtn.innerText = 'Logga In';

    username.type = 'text';
    password.type = 'password';
    superadminLoginBtn.type = 'submit';
    
    superadminLoginForm.classList.add('superadminLoginContainer');
    username.classList.add('superadminLoginUsername');
    password.classList.add('superadminLoginPassword');
    usernameLabel.classList.add('superadminUsernameLabel');
    passwordLabel.classList.add('superadminPasswordLabel');
    superadminLoginBtn.classList.add('superadminLoginBtn');
    loginMsg.classList.add('superadminLoginMsg');

    usernameLabel.append(username);
    passwordLabel.append(password);
    superadminLoginForm.append(heading, usernameLabel, passwordLabel, superadminLoginBtn, loginMsg);
    app!.innerHTML = '';
    app!.append(superadminLoginForm);

    superadminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const loginData: object = {
            username: username.value,
            password: password.value
        }
        superadminLoginCheck(loginData);
    })
} 

export async function superadminLoginCheck (loginData: object) {
    const loginMsg = document.querySelector('.superadminLoginMsg');

    fetch('http://localhost:3000/superadmin', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(loginData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.message) {
            loginMsg!.innerHTML = data.message;
            return;
        }
        console.log('Superadmin är inloggad')
        renderSessionHistory();
    }) 
}

export function renderSessionHistory() {
    const sessionHistoryHeading: HTMLHeadingElement = document.createElement('h1');
    const sessionHistorySubHeading: HTMLHeadingElement = document.createElement('h2');
    const sessionHistoryUl: HTMLUListElement = document.createElement('ul');

    sessionHistoryHeading.innerHTML = 'Planning Poker | Historik';
    sessionHistorySubHeading.innerHTML = 'Klicka på ett namn i listan för att se den sparade sessionen';

    sessionHistoryHeading.classList.add('sessionHistoryHeading');
    sessionHistorySubHeading.classList.add('sessionHistorySubHeading');
    sessionHistoryUl.classList.add('sessionHistoryUl'); 

    fetch('http://localhost:3000/sessions')
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
      const dataFromDatabase = data;

      dataFromDatabase.forEach((session: { adminName: any; }) => {
          console.log('session from db:', session);
          const sessionHistoryLi: HTMLLIElement = document.createElement('li');
          sessionHistoryLi.classList.add('sessionHistoryLi');
          sessionHistoryLi.innerHTML = `Admin: ${session.adminName}`;
          sessionHistoryUl.append(sessionHistoryLi);

          sessionHistoryLi.addEventListener('click', () => renderSessionInfo(session));
      });

      app!.innerHTML = '';
      app!.append(sessionHistoryHeading, sessionHistorySubHeading, sessionHistoryUl);
      superadminLogout();
    })
    .catch(error => {
      console.error('Något gick fel.', error);
    });
};

function renderSessionInfo(session: any) {
    app!.innerHTML = '';
    const sessionHistoryContainer: HTMLDivElement = document.createElement('div');
    const sessionHeading: HTMLHeadingElement = document.createElement('h1');
    const sessionHistoryAdminAndUsers: HTMLParagraphElement = document.createElement('p');

    sessionHistoryContainer.classList.add('sessionHistoryContainer');
    sessionHeading.classList.add('sessionHeading');

    sessionHeading.innerHTML = 'Planning Poker'

    sessionHistoryContainer.append(sessionHeading);
    
    session.topics.forEach((topic: { title: string; averageScore: number; }) => {
        const topicTitleAndScore: HTMLParagraphElement = document.createElement('p');
        sessionHistoryAdminAndUsers.innerHTML = `Admin: ${session.adminName} <br> Users: ${session.userNames}`;
        topicTitleAndScore.innerHTML = `${topic.title} - Medelvärde: ${topic.averageScore} SP`;
        
        sessionHistoryAdminAndUsers.classList.add('sessionHistoryAdminAndUsers');
        topicTitleAndScore.classList.add('topicTitleAndScore');

        sessionHistoryContainer.append(topicTitleAndScore);
    })

    app!.append(sessionHistoryContainer, sessionHistoryAdminAndUsers);
    superadminBackBtn();
};

export function superadminLogout() {
    const superadminLogoutBtn: HTMLButtonElement = document.createElement('button');
    superadminLogoutBtn.innerText = 'Logga ut';
    superadminLogoutBtn.classList.add('superadminLogoutBtn');
    app!.append(superadminLogoutBtn);

    superadminLogoutBtn.addEventListener('click', () => {
        window.location.reload();
    });
};

export function superadminBackBtn() {
    const superadminBackBtn: HTMLButtonElement = document.createElement('button');
    superadminBackBtn.innerText = 'Tillbaka';
    superadminBackBtn.classList.add('superadminBackBtn');
    app!.append(superadminBackBtn);

    superadminBackBtn.addEventListener('click', () => {
        app!.innerHTML = '';
        renderSessionHistory();
    });
};