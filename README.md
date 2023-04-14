# n-puzzle

#### Create and activate virtual enviroment
```sh
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies
```sh
pip install -r requirements.txt
```

#### Run server
```sh
python manage.py runserver
```

#### Manual testing
```sh
# 3 is size field. 1 is heuristic_cooficient. for size 4 and more use [1 .. 3]
python2.7 webapp/logic/npuzzle-gen.py 3 -s | python main.py 1
```
