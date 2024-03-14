import { IStata } from '../service/api'

export function Stata({ stata }: { stata: IStata }) {
  return (
    <div className="py-20 py-lg-20">
      <div className="container mw-screen-xl">
        <div className="row align-items-center mb-20">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-5 ls-tight mb-5">Before you come in, take a look at our statistics.</h1>
            <div className="row mx-n2 mt-12">
              <div className="col-sm-3 mb-3 mb-sm-0">
                <h2 className="text-secondary mb-1">
                  <span className="display-6 fw-semibold">{stata.all_clicks}</span>
                  <span className="counter-extra">+</span>
                </h2>
                <p className="text-muted">Clicks Handled</p>
              </div>

              <div className="col-sm-3 mb-3 mb-sm-0">
                <h2 className="text-secondary mb-1">
                  <span className="display-6 fw-semibold">{stata.users}</span>
                  <span className="counter-extra">+</span>
                </h2>
                <p className="text-muted">Users</p>
              </div>

              <div className="col-sm-3 mb-3 mb-sm-0">
                <h2 className="text-secondary mb-1">
                  <span className="display-6 fw-semibold">{stata.frames}</span>
                  <span className="counter-extra">+</span>
                </h2>
                <p className="text-muted">Frames</p>
              </div>
            </div>
          </div>
          <div className="col-lg-5 ms-lg-auto">
            <div className="vstack gap-8">
              <div>
                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="icon icon-shape text-bg-primary text-lg rounded-circle">
                    <i className="bi bi-door-open"></i>
                  </div>
                  <h3 className="fw-semibold">Keep your finger on the pulse</h3>
                </div>
                <p className="">
                  With the analytics system, you'll be able to monitor activity in your Frames. Every click is
                  cryptographically verified to prevent fraud.
                </p>
              </div>
              <hr className="my-0" />
              <div>
                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="icon icon-shape text-bg-primary text-lg rounded-circle">
                    <i className="bi bi-rocket-takeoff"></i>
                  </div>
                  <h3 className="fw-semibold">Grow exponentially</h3>
                </div>
                <p className="">
                  Exchange unique users across all Frames connected to the service. You'll receive only unique users,
                  providing organic growth without extra costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
