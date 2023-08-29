document.addEventListener("DOMContentLoaded", async function() {
    const facultyList = document.getElementById("faculty-list");

    // CSVファイルのURL
    const classesCSV = "https://ichiken26.github.io/search_class/media/classes.csv";

    // CSVファイルから学部情報を読み込む関数
    async function fetchFaculties() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const faculties = new Set();

        // CSVの学部列から学部情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 1) {
                faculties.add(columns[0]);
            }
        }

        return Array.from(faculties);
    }

    // 学部情報を表示
    const faculties = await fetchFaculties();
    faculties.forEach(faculty => {
        const listItem = document.createElement("li");
        listItem.textContent = faculty;
        facultyList.appendChild(listItem);
    });

    // 学部リストのクリックイベント
    facultyList.addEventListener("click", function(event) {
        const clickedFaculty = event.target.textContent;
        if (clickedFaculty) {
            // 次のページに遷移（building.htmlなど）
            // ここで選択された学部を渡すなどの処理を行う
            window.location.href = `building?faculty=${clickedFaculty}`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // 本番環境のトップページURL
    const productionTopPageURL = "https://ichiken26.github.io/search_class";

    // ログインページにアクセスしているかチェック
    if (window.location.href.endsWith("/login.html")) {
        // ここにログイン処理のコードを記述します
        // 例: ログインが成功した場合、トップページに遷移
        // 例: ログインが失敗した場合は何もしない
    } else if (window.location.href !== productionTopPageURL) {
        // ログイン処理後、トップページ以外にアクセスしている場合、本番環境のトップページにリダイレクト
        window.location.href = productionTopPageURL;
    }
});
