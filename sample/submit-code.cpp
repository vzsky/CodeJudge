#include<bits/stdc++.h>
using namespace std;

int a[10];
int main(){
    for(int i = 0; i < 10; i++) scanf("%d", &a[i]);
    if (a[0] > 938) printf("No");
    else if (a[0] > 500) printf("Yes\n");
    else if (a[0] <= 125) printf("No");
    else if (a[0] <= 250) printf("Yes");
    else if (a[0] < 375) printf("Yes");
    else printf("No");
    return 0;
}