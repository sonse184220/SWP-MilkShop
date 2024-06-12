import './Feedback.css';

const Feedback = ({ feedbacks = [], onAddFeedback, newFeedback, setNewFeedback }) => {
    const { rating, content } = newFeedback;
    const renderStars = (rate) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const className = i <= rate ? 'fill' : 'empty';
            stars.push(
                <li key={i} className={className}>
                    <i className="zmdi zmdi-star"></i>
                </li>
            );
        }
        return stars;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddFeedback();
    };

    return (
        <>
            <div className="tab-pane active" id="review">
                <div className="single-tab-content-item">
                    <h2 className="feedback-title">Feedbacks</h2>
                    <ul className="comment">
                        {feedbacks.map((feedback, index) => (
                            <li key={index} className="comment-list">
                                <div className="comment-wrapper">
                                    <div className="comment-img">
                                        <img src="assets/images/user/image-1.png" alt="User" />
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-content-top">
                                            <div className="comment-content-left">
                                                <h6 className="comment-name">{feedback.Name}</h6>
                                                <ul className="review-star">
                                                    {renderStars(feedback.Rating)}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="para-content">
                                            <p>{feedback.Content}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="review-form">
                        <div className="review-form-text-top">
                            <h5>ADD A REVIEW</h5>
                            {/* <p>Your email address will not be published. Required fields are marked *</p> */}
                        </div>

                        <form action="#" method="post" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="default-form-box">
                                        <label htmlFor="rating">Rating Star</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
                                        >
                                            {[0, 1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="default-form-box">
                                        <label htmlFor="comment-review-text">Your review</label>
                                        <textarea
                                            id="comment-review-text"
                                            value={content}
                                            onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
                                            placeholder="Write a review"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-md btn-black-default-hover" type="submit">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
