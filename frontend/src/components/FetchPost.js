@ -229,6 +229,23 @@ class FetchPost extends Component {
    this.handleCommentChange = this.handleCommentChange.bind(this);
    // this.postListRef = createRef();
  }

  validateLikedDislikedPosts = (userId) => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    const dislikedPosts = JSON.parse(localStorage.getItem("dislikedPosts")) || [];

    const validatedLikedPosts = likedPosts.filter((post) => post.userId === userId);
    const validatedDislikedPosts = dislikedPosts.filter((post) => post.userId === userId);

    localStorage.setItem("likedPosts", JSON.stringify(validatedLikedPosts));
    localStorage.setItem("dislikedPosts", JSON.stringify(validatedDislikedPosts));

    this.setState({
      likedPosts: validatedLikedPosts,
      dislikedPosts: validatedDislikedPosts,
    });
  };

  async componentDidMount() {
    const { maskBackgroundRef } = await this.props;
    const { current } = maskBackgroundRef;
@ -243,6 +260,9 @@ class FetchPost extends Component {
      console.log(error);
    }

    // Validate liked and disliked posts for the current user
    this.validateLikedDislikedPosts(this.props.userId);

    this.fetchPosts();
  }

@ -571,17 +591,17 @@ class FetchPost extends Component {
  fetchPosts = async () => {
    const { page } = this.state;
    const targetUserId = this.props.targetUserId ? this.props.targetUserId : "";
    const userId = this.props.userId ? this.props.userId : "";
    const currentUserId = this.props.userId ? this.props.userId : "";
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(
        process.env.REACT_APP_DEV_API_PATH +
          `/tweet?limit=10&page=${page}&targetUserId=${targetUserId}&userId=${userId}`
          `/tweet?limit=10&page=${page}&targetUserId=${targetUserId}&userId=${currentUserId}`
      );
      const posts = response.data;
      console.log(userId);
      if (posts.length === 0) {
        if (userId !== "" && page === 0) {
        if (currentUserId !== "" && page === 0) {
          this.setState({ isNoPost: true, hasMore: false });
        } else {
          this.setState({ hasMore: false });
@ -632,7 +652,8 @@ class FetchPost extends Component {
                },
              });
              const dislikeCount = response.data.dislikeNum;
              return { ...post, dislikeCount };
              const isDisliked = response.data.isDisliked;
              return { ...post, dislikeCount, isDisliked };
            })
        );

@ -644,17 +665,36 @@ class FetchPost extends Component {
                  userId,
                },
              });
              const isLiked = response.data.isLiked;
              const likeCount = response.data.likeNum;
              return { ...post, likeCount };
              return { ...post, likeCount, isLiked };
            })
        );

        const combinedPosts = postsWithImages.map((post, index) => {
          return {
          const updatedPost = {
            ...post,
            dislikeCount: postsWithDislikeCounts[index].dislikeCount,
            likeCount: postsWithLikeCounts[index].likeCount,
          };

          if (postsWithDislikeCounts[index].isDisliked && !this.state.dislikedPosts.includes(post._id)) {
            this.setState((prevState) => ({
              dislikedPosts: [...prevState.dislikedPosts, post._id],
            }), () => {
              localStorage.setItem("dislikedPosts", JSON.stringify(this.state.dislikedPosts));
            });
          }

          if (postsWithLikeCounts[index].isLiked && !this.state.likedPosts.includes(post._id)) {
            this.setState((prevState) => ({
              likedPosts: [...prevState.likedPosts, post._id],
            }), () => {
              localStorage.setItem("likedPosts", JSON.stringify(this.state.likedPosts));
            });
          }

          return updatedPost;
        });

        this.setState((prevState) => ({
