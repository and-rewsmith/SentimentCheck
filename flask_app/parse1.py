from sentiment import get_sentiment

file = open("charities.txt", "r")

charities = []

for line in file:
	line = line.strip()
	line = line[1:-2]
	charities.append(line)

for entry in charities:
	get_sentiment(entry)

file.close()