echo "I'm cpp judge script. I'm compiling $1 to /graderlog/source"
g++ -std=c++17 $1 -o ./graderlog/source
echo "I'm done compiling"