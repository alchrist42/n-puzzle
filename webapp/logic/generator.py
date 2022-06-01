import random

def make_puzzle(s, solvable, iterations=10000, sharp=1):
	def swap_empty(p):
		idx = p.index(0)
		poss = []
		if idx % s > 0:
			poss.append(idx - 1)
		if idx % s < s - 1:
			poss.append(idx + 1)
		if idx / s > 0 and idx - s >= 0:
			poss.append(idx - s)
		if idx / s < s - 1:
			poss.append(idx + s)
		swi = random.choice(poss)
		p[idx] = p[swi]
		p[swi] = 0
	
	p = make_goal(s)
	for i in range(iterations):
		swap_empty(p)
	
	if not solvable:
		if p[0] == 0 or p[1] == 0:
			p[-1], p[-2] = p[-2], p[-1]
		else:
			p[0], p[1] = p[1], p[0]

	if sharp==2:
		p = [p[i:i + s] for i in range(0, s * s, s)]
	return p

def make_goal(s, sharp=1):
	ts = s*s
	puzzle = [-1 for i in range(ts)]
	cur = 1
	x = 0
	ix = 1
	y = 0
	iy = 0
	while True:
		puzzle[x + y*s] = cur
		if cur == 0:
			break
		cur += 1
		if x + ix == s or x + ix < 0 or (ix != 0 and puzzle[x + ix + y*s] != -1):
			iy = ix
			ix = 0
		elif y + iy == s or y + iy < 0 or (iy != 0 and puzzle[x + (y+iy)*s] != -1):
			ix = -iy
			iy = 0
		x += ix
		y += iy
		if cur == s*s:
			cur = 0

	if sharp==2:
		puzzle = [puzzle[i:i + s] for i in range(0, s * s, s)]
	return puzzle

if __name__ == "__main__":
	puzzle = make_puzzle(random.randint(3,6), solvable=True)
