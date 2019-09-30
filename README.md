# NodeStarter
Starting project for Node 

# https://travis-ci.org/

# Check remote Origin Git
λ git remote -v
origin  https://github.com/User/NodeStarter.git (fetch)
origin  https://github.com/User/NodeStarter.git (push)

# Remove remote Origin Git 
λ git remote remove origin

# Set New Remote Origin Git
λ git remote add origin git@github.com:newUser/NodeCI.git

# Check New Remote Origin Git
λ git remote -v
origin  git@github.com:newUser/NodeCI.git (fetch)
origin  git@github.com:newUser/NodeCI.git (push)

# App all files to commit
λ git add .

# Set name to commit
λ git commit -m Travis CI config"

# Check commits
λ git status

# Update Remote Git 
λ git push origin master