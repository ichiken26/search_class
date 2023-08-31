document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", function() {
        const userID = document.getElementById("userID").value;
        const password = document.getElementById("password").value;

        // CSVファイルのURL
        const loginCSV = "https://ichiken26.github.io/search_class/media/login.csv";

        // CSVファイルからユーザ情報を読み込む関数
        async function fetchUserData() {
            const response = await fetch(loginCSV);
            const text = await response.text();
            const lines = text.split("\n");
            const userData = [];

            // CSVの各行からユーザ情報を抽出
            for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
                const columns = lines[i].split(",");
                if (columns.length >= 3) {
                    userData.push({
                        userID: columns[0].trim(),
                        password: columns[1].trim(),
                        studentID: columns[2].trim()
                    });
                }
            }

            return userData;
        }
        


        fetchUserData().then(userData => {
            
            const user = userData.find(u => u.userID === userID && u.password === password);
            console.log(user)
            if (user) {
                // ログイン成功時の処理
                window.location.href = "https://ichiken26.github.io/search_class/"; // トップページに遷移
            } else {
                alert("UserIDまたはパスワードが違います。");
            }
        });
    });
});
