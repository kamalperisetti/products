// Write your code here

import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Coockies from 'js-cookie'
import {withRouter} from 'react-router-dom'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTheProduct()
  }

  getTheProduct = async () => {
    const jwtToken = Coockies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()

    const updated = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      title: data.title,
      totalReviews: data.total_reviews,
    }

    const simlarProduct = data.similar_products.map(eachS => ({
      availability: eachS.availability,
      brand: eachS.brand,
      description: eachS.description,
      id: eachS.id,
      imageUrl: eachS.image_url,
      price: eachS.price,
      rating: eachS.rating,
      title: eachS.title,
      totalReviews: eachS.total_reviews,
    }))
    this.setState({
      productDetails: updated,
      similarProducts: simlarProduct,
      apiStatus: apiStatusConstants.success,
    })

    if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onCLickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onCLickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onLoadingRender = () => (
    <div data-testid="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onClickShoping = () => {
    const {history} = this.props
    console.log(history)
    history.replace('/products')
  }

  onFailuerRender = () => (
    <div>
      <h1>Product Not Found</h1>
      <img
        className="failuer_i"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <button type="button" onClick={this.onClickShoping}>
        Continue Shopping
      </button>
    </div>
  )

  getTheListrender() {
    const {productDetails, count, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    return (
      <div>
        <Header />
        <div className="product-container">
          <div>
            <img className="productImage" src={imageUrl} alt="product" />
          </div>
          <div>
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="review">
              <p className="rating">
                {rating}
                <img
                  className="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </p>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Avilability: {availability}</p>
            <p>Brad: {brand}</p>
            <hr />
            <div className="btn">
              <button
                data-testid="minus"
                type="button"
                onClick={this.onCLickDecrement}
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                data-testid="plus"
                type="button"
                onClick={this.onCLickIncrement}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <div>
          <h1>Similar Products</h1>

          <ul className="list">
            {similarProducts.map(eachP => (
              <SimilarProductItem key={eachP.id} details={eachP} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getTheListrender()
      case apiStatusConstants.inProgress:
        return this.onLoadingRender()
      case apiStatusConstants.failure:
        return this.onFailuerRender()

      default:
        return null
    }
  }
}

export default withRouter(ProductItemDetails)
