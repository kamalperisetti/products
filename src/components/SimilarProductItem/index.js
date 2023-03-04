// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {
    brand,

    imageUrl,
    price,
    rating,
    title,
  } = details

  return (
    <li className="lll">
      <img
        className="similat-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <p>Rs {price}/-</p>
      <p className="rating">
        {rating}
        <img
          className="star"
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
      </p>
    </li>
  )
}
export default SimilarProductItem
