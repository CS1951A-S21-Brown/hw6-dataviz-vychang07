import pandas as pd

df = pd.read_csv("./data/video_games.csv")
df1 = df.groupby(['Genre']).sum()
print(df1)

na_max = df1['NA_Sales'].idxmax()
print("Top Genre in NA: " + na_max)

eu_max = df1['EU_Sales'].idxmax()
print("Top Genre in EU: " + eu_max)

jp_max = df1['JP_Sales'].idxmax()
print("Top Genre in JP: " + jp_max)

df2 = df.groupby(['Genre', 'Publisher']).sum()
df2.to_csv('./data/top_publishers.csv')