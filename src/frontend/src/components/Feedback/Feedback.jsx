import './Feedback.css'

const Feedback = () => {
    return (
        <>
            <div class="tab-pane active" id="review">
                <div class="single-tab-content-item">
                    <ul class="comment">
                        <li class="comment-list">
                            <div class="comment-wrapper">
                                <div class="comment-img">
                                    <img src="assets/images/user/image-1.png" alt="" />
                                </div>
                                <div class="comment-content">
                                    <div class="comment-content-top">
                                        <div class="comment-content-left">
                                            <h6 class="comment-name">Kaedyn Fraser</h6>
                                            {/* <ul class="review-star">
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="empty"><i class="ion-android-star"></i></li>
                                            </ul> */}
                                        </div>
                                        {/* <div class="comment-content-right">
                                            <a href="#"><i class="fa fa-reply"></i>Reply</a>
                                        </div> */}
                                    </div>

                                    <div class="para-content">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora inventore dolorem a unde modi iste odio amet, fugit fuga aliquam, voluptatem maiores animi dolor nulla magnam ea! Dignissimos aspernatur cumque nam quod sint provident modi alias culpa, inventore deserunt accusantium amet earum soluta consequatur quasi eum eius laboriosam, maiores praesentium explicabo enim dolores quaerat! Voluptas ad ullam quia odio sint sunt. Ipsam officia, saepe repellat. </p>
                                    </div>
                                </div>
                            </div>

                        </li>

                        <li class="comment-list">
                            <div class="comment-wrapper">
                                <div class="comment-img">
                                    <img src="assets/images/user/image-3.png" alt="" />
                                </div>
                                <div class="comment-content">
                                    <div class="comment-content-top">
                                        <div class="comment-content-left">
                                            <h6 class="comment-name">Jaydin Jones</h6>
                                            {/* <ul class="review-star">
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="fill"><i class="ion-android-star"></i></li>
                                                <li class="empty"><i class="ion-android-star"></i></li>
                                            </ul> */}
                                        </div>
                                        {/* <div class="comment-content-right">
                                            <a href="#"><i class="fa fa-reply"></i>Reply</a>
                                        </div> */}
                                    </div>

                                    <div class="para-content">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora inventore dolorem a unde modi iste odio amet, fugit fuga aliquam, voluptatem maiores animi dolor nulla magnam ea! Dignissimos aspernatur cumque nam quod sint provident modi alias culpa, inventore deserunt accusantium amet earum soluta consequatur quasi eum eius laboriosam, maiores praesentium explicabo enim dolores quaerat! Voluptas ad ullam quia odio sint sunt. Ipsam officia, saepe repellat. </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="review-form">
                        <div class="review-form-text-top">
                            <h5>ADD A REVIEW</h5>
                            {/* <p>Your email address will not be published. Required fields are marked *</p> */}
                        </div>

                        <form action="#" method="post">
                            <div class="row">
                                {/* <div class="col-md-6">
                                    <div class="default-form-box">
                                        <label for="comment-name">Your name <span>*</span></label>
                                        <input id="comment-name" type="text" placeholder="Enter your name" required="" />
                                    </div>
                                </div> */}
                                {/* <div class="col-md-6">
                                    <div class="default-form-box">
                                        <label for="comment-email">Your Email <span>*</span></label>
                                        <input id="comment-email" type="email" placeholder="Enter your email" required="" />
                                    </div>
                                </div> */}
                                <div class="col-12">
                                    <div class="default-form-box">
                                        <label for="comment-review-text">Your review <span>*</span></label>
                                        <textarea id="comment-review-text" placeholder="Write a review" required=""></textarea>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-md btn-black-default-hover" type="submit">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Feedback;