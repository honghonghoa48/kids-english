# Kids English 🐣🦊🦉

Ứng dụng học tiếng Anh cho trẻ em, chạy được trên cả **iOS, Android, và Web** từ 1 codebase Expo.

## Tính năng MVP

- **3 cấp độ** theo lứa tuổi:
  - 🐣 Bé Mầm Non (3–6 tuổi)
  - 🦊 Bé Khám Phá (6–10 tuổi)
  - 🦉 Bé Tài Năng (10+ tuổi)
- **9 bài học** vocabulary (Animals, Colors, Numbers, Food, Family, Body, Weather, Jobs, Sports)
- **Phát âm tiếng Anh** chuẩn bằng `expo-speech` (TTS — không cần API key)
- **Bài tập** 3 dạng: nghe-chọn, ghép từ-hình, trắc nghiệm; có chấm điểm
- **2 mini-game**: Word Match & Memory Cards (mở khoá theo tiến độ học)
- **Lưu tiến độ** vào AsyncStorage (mobile) / localStorage (web)
- UI tươi sáng, font lớn, emoji-based theo phong cách **Duolingo Kids**

## Tech stack

- [Expo](https://expo.dev) (SDK 54) + TypeScript
- [expo-router](https://docs.expo.dev/router/introduction/) file-based navigation
- [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/) text-to-speech
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) progress persistence

## Chạy local

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy web (mở http://localhost:8081)
npm run web

# 3. Chạy mobile qua Expo Go
npx expo start
```

Sau đó scan QR code bằng app **Expo Go** trên iOS/Android để chạy thử trên thiết bị thật.

## Cấu trúc thư mục

```
kids-english/
├── app/                    # expo-router screens
│   ├── (tabs)/             # Bottom tabs: Home, Games, Progress
│   ├── level/[id].tsx      # Danh sách bài học trong 1 cấp độ
│   ├── lesson/[id].tsx     # Học từ vựng + TTS
│   ├── exercise/[id].tsx   # Làm bài tập + chấm điểm
│   └── game/[id].tsx       # Mini-game dispatcher
├── components/             # UI dùng chung (Card, BigButton, ProgressBar...)
├── constants/              # theme.ts (Colors, Fonts, Spacing, Radius)
├── data/                   # lessons.ts, games.ts (data JSON)
├── hooks/                  # use-progress, use-tts, use-color-scheme
├── services/               # dictionary.ts (Free Dictionary API)
└── scripts/                # reset-project.js
```

## Free APIs đang dùng

| API | Mục đích | Cần key? |
|---|---|---|
| `expo-speech` (built-in) | Phát âm tiếng Anh | Không |
| [dictionaryapi.dev](https://dictionaryapi.dev/) | Định nghĩa + IPA + ví dụ | Không |

## Roadmap

- [x] MVP: 3 levels × 3 lessons, 2 mini-games, TTS
- [ ] Mini-game Hangman với bóng bay 🎈
- [ ] Mini-game Spelling Bee 🐝
- [ ] Mở rộng bài học (≥ 30 bài, có ngữ pháp)
- [ ] Tài khoản user + đồng bộ cloud
- [ ] Bảng xếp hạng, achievements
- [ ] Pixel-perfect mascot cho từng level
