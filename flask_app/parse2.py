from sentiment import get_sentiment

file = open("charities.txt", "r")

charities = []

for line in file:
	line = line.strip()
	line = line[1:-2]
	charities.append(line)

for i in range(len(charities)-1, len(charities)//2, -1):
	get_sentiment(charities[i])

file.close()
