import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { blogServ } from '../../services/blogServ';
import { jwtDecode } from 'jwt-decode';
import { useAlert } from '../../utils/AlertContext/AlertContext';
import { commentServ } from '../../services/commentServ';

const SocialNetwork = () => {
  const [userId, setUserId] = useState(null); // Lưu trữ ID người dùng đang đăng nhập
  const [posts, setPosts] = useState([]); // Danh sách bài viết
  const [title, setTitle] = useState(''); // Tiêu đề bài viết
  const [selectedImages, setSelectedImages] = useState([]); // Hình ảnh đã chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal trạng thái
  const quillRef = useRef(null); // Ref cho Quill Editor container
  const [quill, setQuill] = useState(null); // Quill Editor instance
  const showAlert = useAlert();

  // Xác định người dùng đang đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    if (token) {
      const decoded = jwtDecode(token); // Giải mã token JWT
      setUserId(decoded.employee_id); // Lưu ID người dùng đang đăng nhập
    }
  }, []);

  // Khởi tạo Quill Editor khi modal được mở
  useEffect(() => {
    if (isModalOpen && quillRef.current) {
      const editor = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
          ],
        },
      });
      setQuill(editor);
    }
  }, [isModalOpen]);

  // Fetch danh sách bài viết
  const fetchPosts = async () => {
    try {
      const response = await blogServ.getallPost();
      setPosts(response.data);
    } catch (error) {
      showAlert('Failed to fetch posts!', 'error');
    }
  };

  // Upload bài viết
  const handlePost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', quill.root.innerHTML);
    formData.append('employee_id', userId); // Gửi employee_id của người đang đăng nhập
    selectedImages.forEach((image) => {
      formData.append('images', image); // Thêm từng ảnh vào FormData
    });

    try {
      await blogServ.createPost(formData);
      setTitle('');
      setSelectedImages([]);
      quill.root.innerHTML = '';
      setIsModalOpen(false);
      fetchPosts();
      showAlert('Post created successfully!', 'success');
    } catch (error) {
      console.error('Error creating post:', error);
      showAlert('Failed to create post!', 'error');
    }
  };

  // Xử lý khi chọn ảnh
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  // Fetch bài viết khi render lần đầu
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Social Network</h1>

      {/* Nút mở modal */}
      <div className="flex justify-start mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff9900] text-white px-4 py-2 rounded hover:bg-[#ec7211]"
        >
          Post Blog
        </button>
      </div>

      {/* Modal đăng bài */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/3">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              className="w-full p-2 mb-4 border rounded"
            />
            <div ref={quillRef} className="mb-4 h-40 border rounded" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
            />
            <div className="flex gap-4 flex-wrap">
              {selectedImages.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx}`}
                  className="w-16 h-16 rounded border"
                />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách bài viết */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts available</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.blog_id}
              className="border-b mb-6 pb-4 flex flex-col items-start"
            >
              <div className="flex items-center gap-4 mb-2">
                {/* Avatar người đăng */}
                <img
                  src={`http://localhost:8080/public/img/${post.Employees.avatar}`}
                  alt={post.Employees.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    Posted by {post.Employees.full_name} on{' '}
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Nội dung bài viết */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              {/* Hình ảnh */}
              <div className="flex gap-4 flex-wrap mt-4">
                {post.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:8080/public/img/${image}`}
                    alt={`Post Image ${idx}`}
                    className="w-96 h-96 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialNetwork;
