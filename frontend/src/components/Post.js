import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg|JPE?G)$/)
);

const Post = () => {
  return (
    <div className="mask-post p-0">
      <div className="text-break post">
        <UserID />
        <PostImage />
        <PostDescription />
      </div>
    </div>
  );
};

const UserID = () => {
  return (
    <div className="post-user-info">
      <img
        src={images["user_avatar.jpg"]}
        className="float-start post-user-avatar"
        alt="user-avatar"
      />
      <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
        <div class="fw-bold">UserName</div>
        <div>#UserID</div>
      </div>
    </div>
  );
};

const PostImage = () => {
  return (
    <div className="post-image-div">
      <img
        src={images["postIMG.JPEG"]}
        className="post-image"
        alt="post-image"
      />
    </div>
  );
};

const PostDescription = () => {
  return (
    <div id="post-describtion">
      <h5>UserName</h5>
      <p>
        Exciting news! Our company just launched a new product that's designed
        to make your life easier. Say goodbye to the hassle of [insert common
        problem here], because our innovative solution has got you covered. With
        [insert product name], you'll enjoy [insert key benefits here], all
        while saving time and effort. But don't just take our word for it - see
        what our happy customers are saying! Head over to our website to learn
        more and get your hands on [insert product name] today. #innovation
        #solution #easylife #newproduct #customersatisfaction
      </p>
    </div>
  );
};

export default Post;
