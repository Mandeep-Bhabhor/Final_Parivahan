import React from 'react';

function ParcelProgressBar({ status }) {
  // Define the status flow
  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: '🛍️' },
    { key: 'accepted', label: 'Accepted', icon: '✓' },
    { key: 'stored', label: 'Stored', icon: '📦' },
    { key: 'loaded', label: 'Loaded', icon: '📦' },
    { key: 'dispatched', label: 'In Transit', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✓' }
  ];

  // Find current status index
  const currentIndex = statuses.findIndex(s => s.key === status);
  const isRejected = status === 'rejected';

  return (
    <div className="parcel-progress-container my-4">
      <h5 className="text-center mb-4">Track Your Order</h5>
      
      {isRejected ? (
        <div className="alert alert-danger text-center">
          <h4>❌ Order Rejected</h4>
          <p>This parcel has been rejected by the company.</p>
        </div>
      ) : (
        <div className="progress-tracker">
          <div className="progress-steps">
            {statuses.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <React.Fragment key={step.key}>
                  <div className="progress-step">
                    <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <span className="step-icon">{step.icon}</span>
                    </div>
                    <div className="step-label">{step.label}</div>
                  </div>
                  
                  {index < statuses.length - 1 && (
                    <div className={`progress-line ${index < currentIndex ? 'completed' : ''}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .parcel-progress-container {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .progress-tracker {
          max-width: 800px;
          margin: 0 auto;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .step-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #e9ecef;
          border: 3px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }

        .step-circle.completed {
          background: #d1ecf1;
          border-color: #17a2b8;
        }

        .step-circle.current {
          background: #cfe2ff;
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(13, 110, 253, 0.1);
          }
        }

        .step-icon {
          font-size: 32px;
        }

        .step-label {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          color: #6c757d;
          max-width: 100px;
        }

        .step-circle.completed + .step-label,
        .step-circle.current + .step-label {
          color: #212529;
        }

        .progress-line {
          flex: 1;
          height: 4px;
          background: #dee2e6;
          margin: 0 -10px;
          margin-bottom: 90px;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .progress-line.completed {
          background: #17a2b8;
        }

        @media (max-width: 768px) {
          .progress-steps {
            flex-direction: column;
          }

          .progress-line {
            width: 4px;
            height: 50px;
            margin: -10px 0;
          }

          .step-circle {
            width: 60px;
            height: 60px;
          }

          .step-icon {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default ParcelProgressBar;
