# n-puzzle (Ecole 42 project)
The goal of this project is to solve the N-puzzle game using the A*
search algorithm or one of its variants. The final board state should be "snail".  
>website made just for fun  
<p align="center">
<img src="https://user-images.githubusercontent.com/82720908/233789363-c0f78a24-4fb2-4fb3-8f40-81e1595e68a8.gif" width="600">
</p>


--- 
### Run web version
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

### Manual testing
```sh
# 3 is size field. 1 is heuristic_cooficient. for size 4 and more use [1 .. 3]
python2.7 webapp/logic/npuzzle-gen.py 3 -s | python main.py 1
```
