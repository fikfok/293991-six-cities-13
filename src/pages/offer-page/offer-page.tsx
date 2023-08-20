import { Helmet } from 'react-helmet-async';
import { OfferDetail, OfferShort } from '../../types/offer';
import { useParams } from 'react-router-dom';
import { OfferCardMode } from '../../const';
import ImagesList from '../../components/offer-images-list/offer-images-list';
import OfferGoodsList from '../../components/offer-goods-list/offer-goods-list';
import OfferHost from '../../components/offer-host/offer-host';
import OfferFeatures from '../../components/offer-features/offer-features';
import OfferPrice from '../../components/offer-price/offer-price';
import OfferRating from '../../components/offer-rating/offer-rating';
import OfferHeader from '../../components/offer-header/offer-header';
import PageHeader from '../../components/page-header/page-header';
import OfferReview from '../../components/offer-review/offer-review';
import OfferCard from '../../components/offer-card/offer-card';
import Map from '../../components/map/map';
import { useAppDispatch, useAppSelector } from '../../hooks';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import { fetchOfferCommentsAction, fetchOfferDetailDataAction, fetchOfferNearByAction, fetchOffersAction } from '../../services/api-actions';
import { useEffect } from 'react';
import { filterNearByOffers } from '../../utils/utils';
import NotFoundPage from '../not-found-page/not-found-page';
import { getAreNearByLoading, getAreOfferCommentsLoading, getIsOfferDetailLoading, getOfferComments, getOfferDetail, getOffersNearBy } from '../../store/offer-detail-process/selectors';
import { deleteOfferDetail } from '../../store/offer-detail-process/offer-detail-process';

function OfferPage(): JSX.Element {
  const isOfferDetailLoading = useAppSelector(getIsOfferDetailLoading);
  const offersNearBy = useAppSelector(getOffersNearBy);
  const filteredOffersNearBy = filterNearByOffers(offersNearBy);
  const offerDetail = useAppSelector(getOfferDetail);
  const areOfferCommentsLoading = useAppSelector(getAreOfferCommentsLoading);
  const areNearByLoading = useAppSelector(getAreNearByLoading);
  const { id: offerId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (offerId) {
      dispatch(fetchOfferDetailDataAction(offerId));
      dispatch(fetchOfferCommentsAction(offerId));
      dispatch(fetchOfferNearByAction(offerId));
    }
    return () => {
      dispatch(deleteOfferDetail());
    };
  }, [offerId, dispatch]);

  if ((offerDetail === undefined || offerDetail === null) && !isOfferDetailLoading && !areOfferCommentsLoading && !areNearByLoading) {
    return <NotFoundPage/>
  }

  const offerDetailNotNull = offerDetail as OfferDetail

  return (
    <div className="page">
      <Helmet>
        <title>6 cities. Offer</title>
      </Helmet>
      <PageHeader/>
      <main className="page__main page__main--offer">
        {
          (isOfferDetailLoading || areOfferCommentsLoading || areNearByLoading) ?
            <LoadingSpinner/> :
            <>
              <section className="offer">
                <ImagesList images={offerDetailNotNull?.images}/>
                <div className="offer__container container">
                  <div className="offer__wrapper">
                    <OfferHeader offerDetail={offerDetailNotNull}/>
                    <OfferRating rating={offerDetailNotNull?.rating}/>
                    <OfferFeatures type={offerDetailNotNull?.type} bedrooms={offerDetailNotNull?.bedrooms} maxAdults={offerDetailNotNull?.maxAdults}/>
                    <OfferPrice price={offerDetailNotNull?.price}/>
                    <OfferGoodsList goods={offerDetailNotNull?.goods}/>
                    <OfferHost description={offerDetailNotNull?.description} host={offerDetailNotNull?.host}/>
                    <OfferReview/>
                  </div>
                </div>
                <Map mode={OfferCardMode.NearPlaces}/>
              </section>
              <div className="container">
                <section className="near-places places">
                  <h2 className="near-places__title">
                    Other places in the neighbourhood
                  </h2>
                  <div className="near-places__list places__list">
                    {filteredOffersNearBy.map((offerShort: OfferShort) => (<OfferCard key={offerShort.id} offer={offerShort} mode={OfferCardMode.NearPlaces}/>))}
                  </div>
                </section>
              </div>
            </>
        }
      </main>
    </div>
  );
}

export default OfferPage;
