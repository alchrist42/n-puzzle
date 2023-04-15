from time import time
from queue import PriorityQueue
from dataclasses import dataclass, field

from webapp.logic.utils import Pos, make_goal_map, get_zero_pos, conver_to_dct
from webapp.logic.checker import check_puzzle


@dataclass(order=True)
class PriItem:
    priority: float
    dist: field(compare=False)
    zero: field(compare=False)
    pzl: field(compare=False)
    moves: field(compare=False)

# @dataclass
# class Solution:
#     moves: list = []
#     len_cache: int = 0
#     iteration: int = 0
#     spend_time: float = 0


class Solver:
    def __init__(self, pzl, print_moves=False, k_heuristic=1):
        self.name = None
        self.pzl = pzl
        self.s = len(pzl)
        self.k_heuristic = max(0.5, min(3, k_heuristic))
        self.max_steps = 0
        self.len_cache = 0
        self.iteration = 0
        self.print_moves = print_moves
        self.raise_timeout = False
        self.start_time = time()

    def heuristic(a: Pos, b: Pos):
        pass

    def run(self):
        self.pzl_is_solvable = check_puzzle(self.pzl)
        if not self.pzl_is_solvable:
            print("Puzzle not solvable")
            return
        zero_pos = get_zero_pos(self.pzl)
        goal_map = make_goal_map(self.s)
        pzl_dict = conver_to_dct(self.pzl)
        goal_dict = conver_to_dct(goal_map)

        dist = sum(self.heuristic(pzl_dict[x], goal_dict[x]) for x in pzl_dict if x)
        dist *= self.k_heuristic
        self.start_heuristic_dist = dist
        visited = set()
        queue = PriorityQueue()
        queue.put(PriItem(dist, dist, zero_pos, self.pzl, []))

        for iter_count in range(10**20):
            self.max_steps = max(self.max_steps, queue.qsize())
            item: PriItem = queue.get()
            dist, cnt, zero, pzl, moves = (
                item.dist,
                len(item.moves),
                item.zero,
                item.pzl,
                item.moves,
            )
            if self.raise_timeout: # hint for future
                return
            if abs(dist) < 0.0001:
                assert pzl == goal_map, "incorrect solution"
                # Solution(moves, len(visited), iter_count, round(time() - self.start_time))
                self.moves = moves
                self.len_cache = len(visited)
                self.iteration = iter_count
                self.spend_time = round(time() - self.start_time, 3)
                self.print_metrics(cnt)
                return self

            possible_moves = []
            if zero.row:
                possible_moves.append(Pos(zero.row - 1, zero.col))
            if zero.row + 1 != self.s:
                possible_moves.append(Pos(zero.row + 1, zero.col))
            if zero.col:
                possible_moves.append(Pos(zero.row, zero.col - 1))
            if zero.col + 1 != self.s:
                possible_moves.append(Pos(zero.row, zero.col + 1))

            # Check heuristic for each possible move
            for move_pos in possible_moves:
                val = pzl[move_pos.row][move_pos.col]
                if moves and move_pos == moves[-1][2]: # 3-5% speed
                    continue
                new_dist = dist - self.k_heuristic * (
                    self.heuristic(move_pos, goal_dict[val])
                    - self.heuristic(zero, goal_dict[val])
                )
                # move list copy to new_moves.append block give only 5% speed
                new_pzl = [line[:] for line in pzl] 
                new_pzl[zero.row][zero.col] = val
                new_pzl[move_pos.row][move_pos.col] = 0
                hash_pzl = hash(tuple(sum(new_pzl, [])))
                if hash_pzl not in visited:
                    visited.add(hash_pzl)
                    new_moves = moves[:]
                    new_moves.append((val, move_pos, zero))
                    queue.put(
                        PriItem(
                            cnt + 1 + new_dist,  # f(x) = g(x) + h(x)
                            new_dist,
                            move_pos,
                            new_pzl,
                            new_moves,
                        )
                    )
        return self

    def print_metrics(self, cnt):
        print("\n\tSolved!")
        print("Evristic name".ljust(20), self.name)
        print("start_heuristic_distance", self.start_heuristic_dist)
        print("Heuristic koof".ljust(20), self.k_heuristic)
        print("Moves".ljust(20), cnt)
        print("Checks".ljust(20), self.iteration)
        print("Cache lenght".ljust(20), self.len_cache)
        print("Max lenght queue".ljust(20), self.max_steps)
        print("Spended time".ljust(20), self.spend_time)
        if self.print_moves:
            print("Moves\n".ljust(20), [f"{val} ({mov.row},{mov.col})->({zero.row},{zero.col})" for val, mov, zero in self.moves])

    @classmethod
    def print_pzl(pzl):
        w = len(str(len(pzl) ** 2))  # длина максимального числа в пазле
        for line in pzl:
            print(*[str(x).rjust(w) for x in line])


class Manhattan(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Manhattan distance"

    def heuristic(self, a: Pos, b: Pos):
        return abs(a.col - b.col) + abs(a.row - b.row)


class Chebyshev(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Chebyshev distance"

    def heuristic(self, a: Pos, b: Pos):
        return max(abs(a.col - b.col), abs(a.row - b.row))


class Euclidean(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Euclidean distance"

    def heuristic(self, a: Pos, b: Pos):
        return ((a.col - b.col) ** 2 + (a.row - b.row) ** 2) ** 0.5
