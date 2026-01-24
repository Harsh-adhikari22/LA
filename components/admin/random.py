import heapq
from math import ceil
def getMaximumStorageEfficiency(num_segments, m):
    s=set(num_segments)
    num_negative=[-i for i in s]
    heapq.heapify(num_negative) #to create max-heap
    del s
    numbers=dict()
    minimum=float('inf')
    for i in num_segments:
        if i not in numbers:
            numbers[i]=0
        numbers[i]+=1
        minimum=min(minimum,i)
    units=len(num_segments)
    steps=0
    while units<m:
        maximum=-heapq.heappop(num_negative)
        half1,half2=ceil(maximum/2),maximum//2
        units+=numbers[maximum]*2 - 1
        minimum=min(minimum,half2)
        if half1 not in numbers:
            heapq.heappush(num_negative,-half1)
            numbers[half1]=0
        if half2 not in numbers:
            heapq.heappush(num_negative,-half2)
            numbers[half2]=0
        numbers[half1]+=numbers[maximum]
        numbers[half2]+=numbers[maximum]
        if units<m:
            numbers.pop(maximum)
        steps+=1
    print(numbers,steps,units)
    return minimum