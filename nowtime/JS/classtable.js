document.addEventListener("DOMContentLoaded", function() {
    const classInfo = document.getElementById("class-info");
    const buildingList = document.getElementById("building-list"); // 追加: 棟一覧表示用の要素
    const timetable = document.getElementById("timetable");

    const urlParams = new URLSearchParams(window.location.search);
    const selectedclassTimes = localStorage.getItem('classTimes');
    const selectedFaculties = urlParams.get("faculty");

    classInfo.textContent = `${selectedFaculties}/${selectedclassTimes}`;

    // CSVファイルの読み込みとデータ表示
    fetch("https://ichiken26.github.io/search_class/media/classes.csv")
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split("\n");
            const headerLine = lines[0];
            const headerElements = headerLine.split(",");
            const classTimeIndex = headerElements.indexOf(selectedclassTimes);

            const classroomsData = lines.slice(1).map(line => line.split(","));
            const filteredClassrooms = classroomsData.filter(data => data[0] === selectedFaculties && data[classTimeIndex] === "0");

            // 教室を「棟」「階層」ごとにグループ化して表示
            const groupedClassrooms = groupBy(filteredClassrooms, data => `${data[1]},${data[2]}`); // 2番目の要素が棟、3番目の要素が階層
            for (const [buildingFloor, classrooms] of Object.entries(groupedClassrooms)) {
                const [building, floor] = buildingFloor.split(",");
                const buildingSection = document.createElement("section");
                buildingSection.innerHTML = `<h2 class="floor-${building}-${floor}F">${building}棟/${floor}F</h2>`;

                const classroomsList = document.createElement("ul");
                classrooms.forEach(classroomData => {
                    const classroomName = classroomData[3]; // 4番目の要素が教室名
                    const classroomBox = document.createElement("li");
                    const classroomLink = document.createElement("a"); // リンク要素を作成
                    classroomLink.href = `https://ichiken26.github.io/search_class/nowtime/table?faculty=${selectedFaculties}&building=${building}&floor=${floor}&classroom=${classroomName}`; // リンク先を設定
                    classroomLink.textContent = classroomName;
                    classroomBox.appendChild(classroomLink); // リンクを<li>内に追加
                    classroomBox.classList.add("classroom-box"); // 教室名ボックスのクラスを追加
                    classroomBox.id = `${building}-${floor}-${classroomName}`;
                    classroomsList.appendChild(classroomBox);
                });
                

                buildingSection.appendChild(classroomsList);
                timetable.appendChild(buildingSection);
            }

            // 棟一覧表示
            const existingBuildings = new Set(); // 既に存在する棟名を保持するSet
            for (const [buildingFloor] of Object.entries(groupedClassrooms)) {
                const [building] = buildingFloor.split(",");
                if (!existingBuildings.has(building)) {
                    existingBuildings.add(building); // 重複しない場合にSetに追加
                    const buildingBox = document.createElement("div");
                    buildingBox.textContent = `${building}棟`;
                    buildingBox.classList.add("building-box");
                    buildingBox.addEventListener("click", () => scrollToFloor(building));
                    buildingList.appendChild(buildingBox);
                }
            }
        })
        .catch(error => {
            console.error("CSVファイルの読み込みエラー: ", error);
        });      
            
});

// 配列をキーごとにグループ化する関数
function groupBy(array, keyFunc) {
    return array.reduce((result, item) => {
        const key = keyFunc(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
}

// 対象の棟の1Fまでスクロールする関数
function scrollToFloor(building) {
    const floorSelector = `.floor-${building}-1F`; // 例: .floor-A-1F
    const floorElement = document.querySelector(floorSelector);
    if (floorElement) {
        const buildingBoxRect = floorElement.getBoundingClientRect(); // 要素の位置を取得
        window.scrollTo({
            top: buildingBoxRect.top + window.scrollY - 100, // 適宜オフセットを調整
            behavior: "smooth"
        });
    }
}
