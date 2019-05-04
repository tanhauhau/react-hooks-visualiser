import React, { useState } from 'react';
import styled from 'styled-components';
const gray = 'rgba(0, 0, 0, 0.2)';
const TabsOuterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const TabsContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
`;

const TabContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  opacity: ${props => (props.active ? 1 : 0)};
  pointer-events: ${props => (props.active ? 'initial' : 'none')};
  transition: opacity 0.2s ease-in-out;
`;
const TabHeaderContainer = styled.div`
  border-bottom: 1px solid ${gray};
`;
const TabHeader = styled.div`
  display: inline-block;
  padding: 8px 16px;
  cursor: pointer;
  color: ${props => (props.active ? 'black' : 'gray')};
`;
const TabDivider = styled.span`
  margin: 4px 0;
  border-left: 1px solid ${gray};
`;

export function Tabs({ defaultTab, children }) {
  const tabs = children.map(child => child.props.name);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);

  return (
    <TabsOuterContainer>
      <TabHeaderContainer>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab}>
            {index > 0 && <TabDivider />}
            <TabHeader
              onClick={() => setActiveTab(tab)}
              active={tab === activeTab}
            >
              {tab}
            </TabHeader>
          </React.Fragment>
        ))}
      </TabHeaderContainer>
      <TabsContainer>
        {children.map(child => {
          if (child.props.name === activeTab) {
            return React.cloneElement(child, { active: true });
          }
          return child;
        })}
      </TabsContainer>
    </TabsOuterContainer>
  );
}
export function Tab({ name, children, active }) {
  return <TabContainer active={active}>{children}</TabContainer>;
}
