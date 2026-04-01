
$git = "C:\Program Files\Git\cmd\git.exe"
& $git init
& $git config user.name "Student"
& $git config user.email "student@example.com"
& $git add .
& $git commit -m "Initial commit of CyberShield dashboard"
& $git branch -M main
& $git remote add origin "https://github.com/Adithyakrishna777/Email-spam-detector.git"
& $git push -u origin main

