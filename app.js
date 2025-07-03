// HTML要素の取得
const aquarium = document.getElementById('aquarium');
const feedButton = document.getElementById('feedButton');
const cleanButton = document.getElementById('cleanButton');
const buyFishButton = document.getElementById('buyFishButton');
const messageDisplay = document.getElementById('message');
const moneyDisplay = document.getElementById('moneyDisplay');
const cleanlinessDisplay = document.getElementById('cleanlinessDisplay');
const fishCountDisplay = document.getElementById('fishCountDisplay');

// ゲームの状態変数
let money = 100; // 所持金
let cleanliness = 100; // 水槽のきれいさ (0-100%)
let fishes = []; // 魚オブジェクトを格納する配列
const FISH_COST = 50; // 魚の購入コスト

// 魚のクラス定義
class Fish {
    constructor(id) {
        this.id = id;
        this.element = document.createElement('div');
        this.element.classList.add('fish');
        // 初期位置を水槽内でランダムに設定
        this.x = Math.random() * (aquarium.offsetWidth - 50);
        this.y = Math.random() * (aquarium.offsetHeight - 30);
        this.hunger = 100; // 満腹度 (0-100%)
        this.speed = Math.random() * 0.5 + 0.5; // 移動速度
        this.directionX = Math.random() > 0.5 ? 1 : -1; // X方向の初期移動方向
        this.directionY = Math.random() > 0.5 ? 1 : -1; // Y方向の初期移動方向
        this.color = `hsl(${Math.random() * 360}, 90%, 60%)`; // ランダムな色
        this.element.style.backgroundColor = this.color;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        aquarium.appendChild(this.element);
    }

    // 魚の状態を更新するメソッド
    update() {
        // 満腹度を徐々に減らす
        this.hunger -= 0.1;
        if (this.hunger < 0) this.hunger = 0;

        // 満腹度によって色とクラスを変更
        if (this.hunger < 30) {
            this.element.classList.add('unhappy'); // 元気がないクラスを追加
            this.element.style.backgroundColor = '#ff6347'; // 元気がない時の色
        } else {
            this.element.classList.remove('unhappy');
            this.element.style.backgroundColor = this.color; // 元の魚の色に戻す
        }

        // 魚を動かす
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        // 壁に当たったら方向転換
        if (this.x <= 0 || this.x >= aquarium.offsetWidth - this.element.offsetWidth) {
            this.directionX *= -1;
            // 魚の向きを変えるためのCSSプロパティ
            this.element.style.transform = `scaleX(${this.directionX})`;
        }
        if (this.y <= 0 || this.y >= aquarium.offsetHeight - this.element.offsetHeight) {
            this.directionY *= -1;
        }

        // HTML要素の位置を更新
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
}

// ゲームの状態表示を更新する関数
function updateStatusDisplay() {
    moneyDisplay.textContent = money;
    cleanlinessDisplay.textContent = Math.round(cleanliness); // 小数点以下を丸める
    fishCountDisplay.textContent = fishes.length;
}

// メッセージ表示関数
function showMessage(msg, type = 'info') {
    messageDisplay.textContent = msg;
    // メッセージタイプに応じて色を変えることも可能
    // messageDisplay.style.color = (type === 'error') ? 'red' : 'green';
    setTimeout(() => {
        messageDisplay.textContent = ''; // 3秒後にメッセージを消す
    }, 3000);
}

// 初期化関数
function initializeGame() {
    // 最初の魚を数匹追加
    for (let i = 0; i < 3; i++) {
        fishes.push(new Fish(i));
    }
    updateStatusDisplay();
}

// エサをあげるボタンのイベントリスナー
feedButton.addEventListener('click', () => {
    if (fishes.length === 0) {
        showMessage("魚がいません！");
        return;
    }
    if (money >= 10) { // エサ代10G
        money -= 10;
        fishes.forEach(fish => {
            fish.hunger += 30; // 満腹度を増やす
            if (fish.hunger > 100) fish.hunger = 100; // 最大100
        });
        showMessage("魚にエサをあげました！みんな元気になったよ。");
    } else {
        showMessage("エサを買うお金が足りません...");
    }
    updateStatusDisplay();
});

// お掃除するボタンのイベントリスナー
cleanButton.addEventListener('click', () => {
    if (cleanliness < 100) {
        if (money >= 20) { // 掃除代20G
            money -= 20;
            cleanliness = 100; // きれいさMAX
            aquarium.style.background = 'linear-gradient(to bottom, #87ceeb, #c7ecee)'; // 水槽の色を元に戻す
            showMessage("水槽をピカピカに掃除しました！");
        } else {
            showMessage("掃除をするお金が足りません...");
        }
    } else {
        showMessage("水槽はもう十分きれいです！");
    }
    updateStatusDisplay();
});

// 新しい魚を買うボタンのイベントリスナー
buyFishButton.addEventListener('click', () => {
    if (money >= FISH_COST) {
        money -= FISH_COST;
        fishes.push(new Fish(fishes.length)); // 新しい魚を追加
        showMessage("新しい魚を買いました！ようこそ！");
    } else {
        showMessage("新しい魚を買うお金が足りません...");
    }
    updateStatusDisplay();
});

// ゲームのメインループ
function gameLoop() {
    // 水槽のきれいさを徐々に減らす
    cleanliness -= 0.02;
    if (cleanliness < 0) cleanliness = 0;

    // きれいさによって水槽の色を変化させる
    if (cleanliness < 30) {
        aquarium.style.background = '#808000'; // 汚い色 (オリーブ)
        showMessage("水槽がとても汚れてきました！");
    } else if (cleanliness < 60) {
        aquarium.style.background = '#add8e6'; // 少し汚い色 (ライトブルー)
    } else {
        aquarium.style.background = 'linear-gradient(to bottom, #87ceeb, #c7ecee)'; // きれいな色
    }

    // 各魚の状態を更新
    fishes.forEach(fish => {
        fish.update();
    });

    // 死んだ魚を削除 (満腹度が0になったら)
    fishes = fishes.filter(fish => {
        if (fish.hunger <= 0 && Math.random() < 0.005) { // 餓死判定（ランダム性を持たせる）
            fish.element.remove(); // HTMLから削除
            showMessage(`魚の${fish.id}が餓死してしまいました...`);
            return false; // 配列から削除
        }
        return true;
    });

    // 所持金を増やす (魚が元気だと少しずつ増える)
    let livingFishCount = fishes.filter(f => f.hunger > 0).length;
    if (livingFishCount > 0) {
        money += 0.1 * livingFishCount; // 魚の数に応じて収入
    }
    
    updateStatusDisplay();
    requestAnimationFrame(gameLoop); // 次のフレームで再度呼び出す (より滑らかなアニメーション)
}

// ゲーム開始
initializeGame();
requestAnimationFrame(gameLoop);
