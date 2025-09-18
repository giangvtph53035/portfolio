# GitHub Projects Integration

## Tổng quan

Ứng dụng đã được cập nhật để lấy dữ liệu projects từ GitHub repositories thay vì database tĩnh. Điều này có nghĩa là:

- **Dữ liệu động**: Projects sẽ tự động cập nhật khi bạn có repositories mới trên GitHub
- **Thông tin thực tế**: Hiển thị số stars, forks, ngôn ngữ lập trình, topics từ GitHub
- **Không cần quản lý database**: Không cần thêm/sửa/xóa projects manually

## API Endpoints

### 1. Lấy tất cả projects
```
GET /api/v1/projects
```

**Parameters:**
- `featured` (boolean): Lọc projects nổi bật
- `technology` (string): Lọc theo công nghệ
- `search` (string): Tìm kiếm theo tên hoặc mô tả
- `sort` (string): Sắp xếp theo (`updated_at`, `created_at`, `stargazers_count`)
- `direction` (string): Hướng sắp xếp (`asc`, `desc`)
- `page` (integer): Trang hiện tại
- `per_page` (integer): Số items per trang

**Example:**
```bash
curl "http://127.0.0.1:8000/api/v1/projects?featured=true&sort=stargazers_count&direction=desc"
```

### 2. Lấy thông tin một project
```
GET /api/v1/projects/{repository-name}
```

**Example:**
```bash
curl "http://127.0.0.1:8000/api/v1/projects/portfolio"
```

### 3. Lấy featured projects
```
GET /api/v1/projects/featured
```

### 4. Lấy danh sách technologies
```
GET /api/v1/projects/technologies
```

## Cấu hình

### 1. GitHub Token & Username

Thêm vào file `.env`:
```env
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_USERNAME=your_github_username
```

### 2. Tạo GitHub Personal Access Token

1. Vào GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Chọn các permissions:
   - `repo` (để truy cập public repositories)
   - `user` (để đọc thông tin user)
4. Copy token và paste vào `.env`

## Cách hoạt động

### 1. Data Mapping

Dữ liệu từ GitHub repository được mapping thành format Project:

```php
// GitHub Repository -> Project Format
[
    'id' => $repo['id'],
    'title' => 'Portfolio Website',  // Từ repo name
    'slug' => 'portfolio-website',
    'description' => $repo['description'],
    'technologies' => [$repo['language'], ...$repo['topics']],
    'github_url' => $repo['html_url'],
    'stargazers_count' => $repo['stargazers_count'],
    'language' => $repo['language'],
    'topics' => $repo['topics'],
    // ... other fields
]
```

### 2. Featured Projects

Projects được coi là "featured" nếu:
- Có nhiều hơn 0 stars
- Có topic `featured` hoặc `portfolio` 

### 3. Caching

- **All projects**: Cache 10 phút
- **Single project**: Cache 5 phút
- **Cache key format**: `github_projects_{username}`, `github_project_{username}_{repo}`

### 4. Technologies

Được extract từ:
- `language` field của repository
- `topics` array của repository

## Test API

Sau khi cấu hình GitHub token, bạn có thể test:

```bash
# Test lấy tất cả projects
curl "http://127.0.0.1:8000/api/v1/projects"

# Test lấy featured projects  
curl "http://127.0.0.1:8000/api/v1/projects/featured"

# Test lấy technologies
curl "http://127.0.0.1:8000/api/v1/projects/technologies"

# Test lấy một project cụ thể
curl "http://127.0.0.1:8000/api/v1/projects/{repository-name}"
```

## Troubleshooting

### Lỗi "GitHub token hoặc username chưa được cấu hình"
- Kiểm tra file `.env` có `GITHUB_TOKEN` và `GITHUB_USERNAME`
- Restart server sau khi update `.env`

### Lỗi "Không thể lấy dữ liệu từ GitHub API"
- Kiểm tra GitHub token còn valid
- Kiểm tra username có đúng
- Kiểm tra internet connection

### Không có dữ liệu trả về
- Kiểm tra username có repositories public
- Kiểm tra token có permission đúng

## Files đã thay đổi

1. **app/Services/GitHubProjectService.php** - Service xử lý logic chính
2. **app/Http/Controllers/ProjectController.php** - Controller sử dụng GitHubProjectService
3. **config/services.php** - Thêm cấu hình GitHub
4. **routes/api.php** - Routes cho GitHub API

## Kết quả

✅ **Dynamic Data**: Projects tự động sync với GitHub repos  
✅ **Real-time Info**: Stars, forks, languages, topics từ GitHub  
✅ **Caching**: Performance tối ưu với cache  
✅ **Filtering & Search**: Filter theo technology, search, sort  
✅ **Featured Projects**: Auto-detect dựa trên stars và topics  
✅ **Compatible API**: Giữ nguyên API structure để frontend không cần thay đổi  