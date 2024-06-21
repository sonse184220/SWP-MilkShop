import './Feedback.css';
import { toast } from 'react-toastify';
import StarRatings from 'react-star-ratings';

const Feedback = ({ feedbacks = [], onAddFeedback, onDeleteFeedback, newFeedback, setNewFeedback }) => {
    const { rating, content } = newFeedback;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            // Display a toast notification if no rating is selected
            toast.error('Please select a rating between 1 and 5 stars.', {
                theme: "colored",
            });
            return;
        }
        onAddFeedback();
    };

    return (
        <>
            <div className="tab-pane active" id="review">
                <div className="single-tab-content-item">
                    <h2 className="feedback-title">Feedbacks</h2>
                    <ul className="comment">
                        {feedbacks.length > 0 ? (

                            feedbacks.map((feedback, index) => (
                                <li key={index} className="comment-list">
                                    <div className="comment-wrapper">
                                        <div className="comment-img">
                                            <img src="/img/user.png" alt="User" />
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-content-top">
                                                <div className="comment-content-left">
                                                    <h6 className="comment-name">{feedback.Name}</h6>
                                                    <ul className="review-star">
                                                        <StarRatings
                                                            rating={feedback.Rating}
                                                            starRatedColor="gold"
                                                            numberOfStars={5}
                                                            starDimension="17px"
                                                            starSpacing="2px"
                                                            name='rating'
                                                        />
                                                    </ul>
                                                </div>
                                                {(feedback.UserID === JSON.parse(localStorage.getItem('userData')).UserID) && (
                                                    <div class="comment-content-right">
                                                        <a href="#" onClick={(e) => onDeleteFeedback(e, feedback.FeedbackID)}><i className="zmdi zmdi-delete"></i>Delete</a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="para-content">
                                                <p>{feedback.Content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))

                        ) : (
                            <div>No feedback available</div>
                        )}
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
                                        <StarRatings
                                            rating={rating}
                                            starRatedColor="gold"
                                            changeRating={(newRating) => setNewFeedback({ ...newFeedback, rating: newRating })}
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
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
