from time import time
from queue import PriorityQueue
from dataclasses import dataclass, field

from utils import Pos, make_goal_map, get_zero_pos, conver_to_dct


@dataclass(order=True)
class PriItem:
    priority: float
    dist: field(compare=False)
    zero: field(compare=False)
    pzl: field(compare=False)
    moves: field(compare=False)


class Solver:
    def __init__(self, pzl, optimizator=0):
        self.name = None
        self.pzl = pzl
        self.s = len(pzl)
        self.optimizator = optimizator
        self.max_steps = 0
        self.len_cache = 0
        self.iteration = 0
        self.start_time = time()

    def evristic(a: Pos, b: Pos):
        pass

    def run(self):
        zero = get_zero_pos(self.pzl)
        helper = make_goal_map(self.s)
        dhlp = conver_to_dct(helper)
        dpzl = conver_to_dct(self.pzl)

        start_dist = sum(self.evristic(dpzl[x], dhlp[x]) for x in dpzl if x)
        passed = set()
        queue_steps = PriorityQueue()
        queue_steps.put(PriItem(start_dist, start_dist, zero, self.pzl, []))
        k = 1 / max(1, 8 - self.optimizator)
        for iter_count in range(0, 10**20):
            self.max_steps = max(self.max_steps, queue_steps.qsize())
            q: PriItem = queue_steps.get()
            dist, cnt, z, pzl, moves = q.dist, len(q.moves), q.zero, q.pzl, q.moves
            if abs(dist) < 0.0001:
                self.moves = moves
                self.len_cache = len(passed)
                self.iteration = iter_count
                self.spend_time = round(time() - self.start_time, 3)
                self.print_mertics(cnt)
                return
            poss = []
            if z.row:
                poss.append(Pos(z.row - 1, z.col))
            if z.row + 1 != self.s:
                poss.append(Pos(z.row + 1, z.col))
            if z.col:
                poss.append(Pos(z.row, z.col - 1))
            if z.col + 1 != self.s:
                poss.append(Pos(z.row, z.col + 1))

            # проверяем евристики для каждого возможного хода
            for pos in poss:
                val = pzl[pos.row][pos.col]
                new_pzl = [line[:] for line in pzl]
                # dist_val = self.evristic(pos, dhlp[val]) - self.evristic(z, dhlp[val])
                # новое 'расстояние' между целевым и текущим полем
                new_dist = dist - (
                    self.evristic(pos, dhlp[val]) - self.evristic(z, dhlp[val])
                )
                new_pzl[z.row][z.col] = val
                new_pzl[pos.row][pos.col] = 0
                # Если такой вариант пазла еще не добавляли в возможные ходы
                hash_pzl = hash(tuple(sum(new_pzl, [])))
                if hash_pzl not in passed:
                    passed.add(hash_pzl)
                    new_moves = moves[:]
                    new_moves.append((val, pos, z))
                    # Ход вставляется в приоритетную очередь по сумме евристики и кол-ва шагов
                    queue_steps.put(
                        PriItem(
                            new_dist + (cnt + 1) * k, new_dist, pos, new_pzl, new_moves
                        )
                    )

    def print_mertics(self, cnt):
        print("\n\tSolved!")
        print("Evristic name".ljust(20), self.name)
        print("Optimizator koof".ljust(20), self.optimizator)
        print("Moves".ljust(20), cnt)
        print("Checks".ljust(20), self.iteration)
        print("Cache lenght".ljust(20), self.len_cache)
        print("Max lenght queue".ljust(20), self.max_steps)
        print("Spended time".ljust(20), self.spend_time)

    @classmethod
    def print_pzl(pzl):
        w = len(str(len(pzl) ** 2))  # длина максимального числа в пазле
        for line in pzl:
            print(*[str(x).rjust(w) for x in line])


class Manhattan(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Manhattan distance"

    def evristic(self, a: Pos, b: Pos):
        return abs(a.col - b.col) + abs(a.row - b.row)


class Chebyshev(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Chebyshev distance"

    def evristic(self, a: Pos, b: Pos):
        return max(abs(a.col - b.col), abs(a.row - b.row))


class Euclidean(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Euclidean distance"

    def evristic(self, a: Pos, b: Pos):
        return ((a.col - b.col) ** 2 + (a.row - b.row) ** 2) ** 0.5
