from sentiment import get_sentiment

file = open("charities.txt", "r")

charities = []

for line in file:
	line = line.strip()
	line = line[1:-2]
	charities.append(line)

for i in range(0, len(charities)//2):
    get_sentiment(charities[i])

file.close()
