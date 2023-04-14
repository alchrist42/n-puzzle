### немного текста о подключении reacta будующей версии меня
React может работать на отдельно висящем сервере/docker, и тогда в django нужно добавить corsheaders и все с ними связанное  
Здесь вариант со статичными файлами, когда npm нужен только на этапе разработки.
- ставим npm & npx
```shell
sudo apt update
sudo apt install nodejs npm
nodejs --version

# вероятно версия 10, а мы хотим новее
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version

npm install -g npx 
```

- создаем проект для фронта в папке с django (где лежит manage.py)
```shell
npx create-react-app front
cd front

# чекаем что работает
npm start

npm build
```

- Теперь нужно не забыть убрать build из .gitignore. Это и есть место, где хранятся готовые файлы для фронта. А значит нужно рассказать об это джанго. в **setting.py** добавляем/редактируем
```py
import os
...
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'front', 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
...
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'front', 'build', 'static')]
```
- не забывает обновить view.py и urls.py
```py
# views.py
def index(request):
    return render(request, "index.html")

# urls.py
...
from .views import index, new_puzzle, solver

urlpatterns = [
    path("", index, name="front"),
]
```
--- 
#### watch
Чтобы каждый раз не писать *npm run build* нужно в package.json добавить
```json
...
"dependencies": {
  "watch": "latest"
}
...
"scripts": {
  "watch": "watch 'npm run build' ."
},
...
```
Теперь можно использовать `npm run watch` но перед коммитом лучше все же писать `npm run build`
