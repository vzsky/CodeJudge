./graderlog/source < $1/$2.in > ./graderlog/temp$2.out
diff -w ./graderlog/temp$2.out $1/$2.sol