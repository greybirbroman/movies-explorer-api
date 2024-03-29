<h1 align="center"> Серверная часть Дипломного проекта "Movies-Explorer"</h1>

- Проект реализован на `Node` с применением `Express`;
- Для работы с базами данных используется `MongoDB`;
- Реализовано логирование и централизованная обработка ошибок;
- Валидация данных приходящих в теле и парамерах запроса;
- У пользователя нет возможности удалять "чужие" публикации;
- Настроены маршруты;

___
`Пример запроса`

<img src="./images/screenshot_post.png"/>

___

### Запуск проекта:
1. Клонировать репозиторий
```
git clone https://github.com/greybirbroman/movies-explorer-api.git
```
2. Установить зависимости
```
npm ci
```
3. Запустить сервер
```
npm run start
npm run dev (hot-reload)
```
[Server Domain](https://api.greybirbmovies.nomoredomains.icu)
